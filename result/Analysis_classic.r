library(tidyverse)

rm(list = ls()) 

df.M <- read.csv('df_pilot_online_SALT_open.csv')

# 计算基本信息
df.M.basic <- df.M %>% 
      dplyr::select(subj_idx, sex, age, edu) %>% 
      dplyr::distinct(subj_idx, sex, age) %>% 
      dplyr::summarise(subj_N = length(subj_idx),
                       female_N = sum(sex == 'female'),
                       male_N = sum(sex == 'male'),
                       Age_mean = round(mean(age),2),
                       Age_sd   = round(sd(age),2)
      )

# check trials number, doubt check the data: v010001's trials number is not correct
df.M.trials <- df.M %>%
      dplyr::filter(block_type == "test") %>%
      dplyr::group_by(subj_idx, match, valence) %>%
      dplyr::summarise(n = n())
      
# Exclude participants if necessary
subj_excld_list <- df.M %>% 
      dplyr::filter(block_type == "test") %>%
      dplyr::group_by(subj_idx) %>%
      dplyr::summarise(meanACC = mean(acc)) %>%
      dplyr::filter(meanACC <= 0.6) %>%
      dplyr::pull(subj_idx)

# will exclude one participant

# invalide trials

num_invalid_trial <- df.M %>% 
      dplyr::filter(block_type == "test") %>%                   # exclude practice trials
      dplyr::filter(!(subj_idx %in% subj_excld_list)) %>%       # exclude invalid participant
      dplyr::filter(rt <= 200) %>%
      dplyr::summarise(n = n()) %>%
      dplyr::pull(n)

# ratio of invalid trials
num_invalid_trial_ratio <- df.M %>% 
      dplyr::filter(block_type == "test") %>%                   # exclude practice trials
      dplyr::filter(!(subj_idx %in% subj_excld_list)) %>%   # exclude invalid participant
      dplyr::summarise(n = n()) %>%
      dplyr::mutate(ratio = num_invalid_trial/n)

# 计算Dprime

df.M.Dprime <- df.M %>% 
      dplyr::filter(block_type == "test") %>%                   # exclude practice trials
      dplyr::filter(!(subj_idx %in% subj_excld_list)) %>%       # exclude invalid participant
      dplyr::filter(rt >= 200) %>%                              # exclude very short response
      dplyr::filter(subj_idx != 'v010001') %>%                  # temperarily exclude v010001
      dplyr::select(subj_idx, match, valence, acc) %>%
      dplyr::mutate(
            hit = ifelse(acc == 1 & match == "match", 1, 0),    # hit
            cr = ifelse(acc == 1 & match != "match", 1, 0),     # correct rejection
            miss = ifelse(acc == 0 & match == "match", 1, 0),   # miss
            fa = ifelse(acc == 0 & match != "match", 1, 0)      # false alarm
      ) %>% 
      dplyr::group_by(
            subj_idx, valence
      ) %>% 
      dplyr::summarise(
            # rt = mean(as.integer(rt), na.rm = T),
            hit = sum(hit),
            fa = sum(fa),
            miss = sum(miss),
            cr = sum(cr)
      ) %>% 
      dplyr::mutate(
            hitP = ifelse(hit / (hit + miss) < 1 & hit / (hit + miss) > 0, 
                          hit / (hit + miss), 
                          1 - 1/(2 * (hit + miss))),
            faP = ifelse(fa / (fa + cr) > 0 & fa / (fa + cr) < 1, 
                         fa / (fa + cr), 
                         1/(2 * (fa + cr))),
            dPrime = qnorm(hitP) - qnorm(faP)
      )

# 计算分组平均RT时间
df.M.RT <- df.M %>% 
      dplyr::filter(block_type == "test") %>%                   # exclude practice trials
      dplyr::filter(!(subj_idx %in% subj_excld_list)) %>%       # exclude invalid participant
      dplyr::filter(rt >= 200) %>%                              # exclude very short response
      dplyr::filter(acc == 1) %>%
      dplyr::filter(subj_idx != 'v010001') %>%                  # temperarily exclude v010001
      dplyr::group_by(
            subj_idx, valence, match
      ) %>% 
      dplyr::summarise(
            rt = mean(as.integer(rt), na.rm = T)
      )

# 开始传统的重复测量方差分析
resultDprime <-  aov(dPrime ~ valence + Error(subj_idx/(valence)), df.M.Dprime) %>% 
      summary()

resultRT <-  aov(rt ~ valence * match + Error(subj_idx/(valence + match)), df.M.RT) %>% 
      summary()

# 长 宽 转换，以JASP分析

# reshape2::melt(df.M.RT, id.vars = c("subj_idx")) # 宽转长

# reshape2::dcast(df.M.RT, subj_idx ~  match + valence) # 长转宽
# reshape2::dcast(df.M.Dprime, subj_idx ~  valence) # 长转宽

df.M_wide <- merge(
      reshape2::dcast(df.M.RT, subj_idx ~  match + valence, value.var = "rt"), 
      reshape2::dcast(df.M.Dprime, subj_idx ~  valence, value.var = "dPrime"), 
      by.x = "subj_idx"
      ) %>%
      dplyr::rename(d_bad = bad,
                    d_good = good,
                    d_ordinary = ordinary)

write.csv(df.M_wide, file = 'df.M.sum_jasp.csv', row.names = F)

# 贝叶斯的分析
library(BayesFactor)

## RT 反应时
df.M.RT.By <- as.data.frame(df.M.RT)

df.M.RT.By$subj_idx <- factor(df.M.RT.By$subj_idx)
df.M.RT.By$valence <- factor(df.M.RT.By$valence)
df.M.RT.By$match <- factor(df.M.RT.By$match)

df.M.RT.ByResult = anovaBF(rt ~ valence * match + subj_idx, data = df.M.RT.By, 
                           whichRandom="subj_idx")

## Dprime
df.M.Dprime.By <- as.data.frame(df.M.Dprime)

df.M.Dprime.By$subj_idx <- factor(df.M.Dprime.By$subj_idx)
df.M.Dprime.By$valence <- factor(df.M.Dprime.By$valence)

df.M.Dprime.ByResult = anovaBF(rt ~ valence + subj_idx, data = df.M.Dprime.By, 
                               whichRandom="subj_idx")


## plot the data
df.rt <- df.M.RT %>%       
      dplyr::rename(Subject = subj_idx,
                    Matchness = match,
                    RT_m = rt, 
                    Valence = valence) %>%
      dplyr::mutate(Valence = ifelse(Valence == "good",  'Good', 
                                     ifelse(Valence == 'bad', 'Bad', 'Neutral')))
df.d <- df.M.Dprime %>%
      dplyr::rename(Subject = subj_idx,
                    Valence = valence,
                    dprime = dPrime) %>%
      dplyr::mutate(Valence = ifelse(Valence == "good",  'Good', 
                                     ifelse(Valence == 'bad', 'Bad', 'Neutral')))

plot <- Val_plot_NHST(df.rt, df.d)
      
# new plot for valence effect
Val_plot_NHST <- function(df.rt, df.d){
      df.plot <- df.rt %>%
            dplyr::filter(Matchness == 'match') %>%  # select matching data for plotting only.
            dplyr::rename(RT = RT_m) %>%
            dplyr::full_join(., df.d) %>%  
            tidyr::pivot_longer(., cols = c(RT, dprime), 
                                names_to = 'DVs', 
                                values_to = "value") %>% # to longer format
            dplyr::mutate(Valence =factor(Valence, levels = c('Good','Neutral', 'Bad')),
                          DVs = factor(DVs, levels = c('RT', 'dprime')),
                          # create an extra column for ploting the individual data cross different conditions.
                          Conds = ifelse(Valence == 'Good', 1, 
                                         ifelse(Valence == 'Neutral', 2, 3))
                          # Conds = mosaic::derivedFactor("1" = (Valence == 'Good'), 
                          #                               "2" = (Valence == 'Neutral'),
                          #                               "3" = (Valence == 'Bad'),
                          #                               method ="first", .default = NA),
                          # Conds = as.numeric(as.character(Conds)),
            ) 
      
      df.plot$Conds_j <- jitter(df.plot$Conds, amount=.09) # add gitter to x
      
      # New facet label names for panel variable
      # https://stackoverflow.com/questions/34040376/cannot-italicize-facet-labels-with-labeller-label-parsed
      levels(df.plot$DVs ) <- c("RT"=expression(paste("Reaction ", "times (ms)")),
                                "dprime"=expression(paste(italic("d"), ' prime')))
      levels(df.plot$DVs ) <- c("RT"=expression(paste("Reaction ", "times (ms)")),
                                "dprime"=expression(paste(italic("d"), ' prime')))
      
      df.plot.sum_p <- df.plot  %>% 
            dplyr::group_by(Valence,DVs) %>%
            dplyr::summarise(mean = mean(value),
                             sd = sd(value),
                             n = n()) %>%
            dplyr::mutate(se = sd/sqrt(n)) %>%
            dplyr::rename(value = mean) %>%
            dplyr::mutate(Val_num = ifelse(Valence == 'Good', 1,
                                           ifelse(Valence == 'Neutral', 2, 3)))

      # df.plot.sum_p <- summarySE(df.plot, measurevar = "value", groupvars = c('Valence',"DVs")) %>%
      #       dplyr::mutate(Val_num = ifelse(Valence == 'Good', 1,
      #                                      ifelse(Valence == 'Neutral', 2, 3)))
      
      pd1 <- position_dodge(0.5)
      scaleFUN <- function(x) sprintf("%.2f", x)
      scales_y <- list(
            RT = scale_y_continuous(limits = c(400, 900)),
            dprime = scale_y_continuous(labels=scaleFUN)
      )
      
      p_df_sum <- df.plot  %>% # dplyr::filter(DVs== 'RT') %>%
            ggplot(., aes(x = Valence, y = value, colour = as.factor(Valence))) +
            geom_line(aes(x = Conds_j, y = value, group = Subject),         # link individual's points by transparent grey lines
                      linetype = 1, size = 0.8, colour = "#000000", alpha = 0.06) + 
            geom_point(aes(x = Conds_j, y = value, group = Subject),   # plot individual points
                       colour = "#000000",
                       size = 3, shape = 20, alpha = 0.1) +
            geom_line(data = df.plot.sum_p, aes(x = as.numeric(Valence), # plot the group means  
                                                y = value, 
                                                #group = Identity, 
                                                colour = as.factor(Valence),
            ), 
            linetype = 1, position = pd1, size = 2)+
            geom_point(data = df.plot.sum_p, aes(x = as.numeric(Valence), # group mean
                                                 y = value, 
                                                 #group = Identity, 
                                                 colour = as.factor(Valence),
            ), 
            shape = 18, position = pd1, size = 5) +
            geom_errorbar(data = df.plot.sum_p, aes(x = as.numeric(Valence),  # group error bar.
                                                    y = value, # group = Identity, 
                                                    colour = as.factor(Valence),
                                                    ymin = value- 1.96*se, 
                                                    ymax = value+ 1.96*se), 
                          width = .05, position = pd1, size = 2, alpha = 0.75) +
            scale_colour_brewer(palette = "Dark2") +
            scale_x_continuous(breaks=c(1, 2, 3),
                               labels=c("Good", "Neutral", "Bad")) +
            scale_fill_brewer(palette = "Dark2") +
            #ggtitle("A. Matching task") +
            theme_bw()+
            theme(panel.grid.major = element_blank(),
                  panel.grid.minor = element_blank(),
                  panel.background = element_blank(),
                  panel.border = element_blank(),
                  text=element_text(family='Times'),
                  legend.title=element_blank(),
                  #legend.text = element_text(size =6),
                  legend.text = element_blank(),
                  legend.position = 'none',
                  plot.title = element_text(lineheight=.8, face="bold", size = 18, margin=margin(0,0,20,0)),
                  axis.text = element_text (size = 8, color = 'black'),
                  axis.title = element_text (size = 8),
                  axis.title.x = element_blank(),
                  axis.title.y = element_blank(),
                  axis.line.x = element_line(color='black', size = 1),    # increase the size of font
                  axis.line.y = element_line(color='black', size = 1),    # increase the size of font
                  strip.text = element_text (size = 6, color = 'black'),  # size of text in strips, face = "bold"
                  panel.spacing = unit(1.5, "lines")
            ) +
            facet_wrap( ~ DVs,
                        scales = "free_y", nrow = 1,
                        labeller = label_parsed)
      return(p_df_sum)
}