rm(list = ls()) 
library(tidyverse)

# Jspsych 图
df.M <- read.csv('df_pilot_online_SALT_open.csv')
# 将需要的数组转换为 integer
df.M$rt[df.M$rt != "null"] <- as.integer(df.M$rt[df.M$rt != "null"])
df.M$acc <- as.integer(df.M$acc)

df.M$rt <- as.integer(df.M$rt)

df.M1 <- df.M %>% 
  dplyr::filter(
    block_type == "test",
    !is.na(rt)
  )

gg_js_1 <- df.M1 %>%
  dplyr::group_by(label_en, match, acc) %>% 
  dplyr::summarise(
    a = n() / length(
      label_en[
        df.M1$label_en == label_en & 
          df.M1$match == match
      ]
    ),
    q1 = quantile(rt, probs = c(.1), na.rm = T),
    q3 = quantile(rt, probs = c(.3), na.rm = T),
    q5 = quantile(rt, probs = c(.5), na.rm = T),
    q7 = quantile(rt, probs = c(.7), na.rm = T),
    q9 = quantile(rt, probs = c(.9), na.rm = T),
  ) %>% 
  pivot_longer(cols = c(q1,q3,q5,q7,q9), names_to = "q")

ggplot(gg_js_1, aes(x = a, y = value, group = q)) + 
  geom_point(aes(shape = label_en)) + 
  geom_line(aes(colour = q)) + 
  facet_grid(. ~ match)


# Eprime 图

df.E <- read.csv('rawdata_behav_exp1a_201404_2019_export.csv') %>% 
  dplyr::filter(
    !is.na(BlockList.Sample),
    Target.RT > 0
  )
df.E$Label <- ifelse(df.E$Label == "好人", "Good", ifelse(df.E$Label == "坏人", "Bad", "Ord"))
df.E$YesNoResp <- ifelse(df.E$YesNoResp == "Yes", "Match", "Mismatch")
gg_eprime_1 <- df.E %>%
  dplyr::group_by(Label, YesNoResp, Target.ACC) %>% 
  dplyr::summarise(
    a = n() / length(
      Label[
        df.E$Label == Label & 
          df.E$YesNoResp == YesNoResp
      ]
    ),
    q1 = quantile(Target.RT, probs = c(.1), na.rm = T),
    q3 = quantile(Target.RT, probs = c(.3), na.rm = T),
    q5 = quantile(Target.RT, probs = c(.5), na.rm = T),
    q7 = quantile(Target.RT, probs = c(.7), na.rm = T),
    q9 = quantile(Target.RT, probs = c(.9), na.rm = T),
  ) %>% 
  pivot_longer(cols = c(q1,q3,q5,q7,q9), names_to = "q")

ggplot(gg_eprime_1, aes(x = a, y = value, group = q)) + 
  geom_point(aes(shape = Label)) + 
  geom_line(aes(colour = q)) + 
  facet_grid(. ~ YesNoResp)

