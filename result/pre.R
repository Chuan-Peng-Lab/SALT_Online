if (exists("df.M")) rm("df.M")
library(tidyverse)

# 读取数据文件列表
file <- list.files("data")

for (f in file) {
  # 读取单个数据文件，并赋值给va
  va <- read.csv(paste("data/", f, sep=""), header=TRUE, sep=",", stringsAsFactors = F)
  # 读取被试基本信息
  id <- paste("v01", jsonlite::fromJSON(va$responses[2])$Q1, sep="") # 被试ID
  sex = va$response[5] # 被试性别
  birth = jsonlite::fromJSON(va$responses[6])$Q0 # 被试出生年份
  edu = jsonlite::fromJSON(va$responses[7])$Q0 # 被试学历
  match = va$sti_match[1] # 被试匹配按键
  mismatch = va$sti_mismatch[1] # 被试不匹配按键
  stiType = va$sti_group[1] # 被试刺激类型，即所分配到的组别
  # 获取匹配状态
  # 如： 圆形——好人、正方形——坏人、三角形——常人
  tmp3 <- va %>%
    dplyr::filter(
      key == match
    ) %>%
    dplyr::distinct(
      label_en, shape_en
    )
  # 提取所需数据，并赋值给tmp2Data
  tmp2Data <- va[-1:-7, ] %>%
    dplyr::rename(
      correctRp = key,
      acc = correct
    ) %>%
    dplyr::mutate(
      subjectIndex = id, 
      subjectSex = ifelse(sex == 1, "male", ifelse(sex == 2, "female", "other")), 
      subjectBirth = birth,
      subjectAge = 2021 - as.integer(birth) + 1,
      subjectEdu = edu,
      subjectStiGroup = stiType,
      response = ifelse(key_press == 78, "n", ifelse(key_press == 77, "m", "NA")),
      acc = ifelse(as.logical(acc) == TRUE, 1, ifelse(as.logical(acc) == FALSE, 0, "NA")),
      match = ifelse(correctRp == match, "match", "mismatch"),
      valence = ifelse(shape_en == "square", tmp3$label_en[tmp3$shape_en == "square"],
                    ifelse(shape_en == "circular", tmp3$label_en[tmp3$shape_en == "circular"], 
                           ifelse(shape_en == "triangle", tmp3$label_en[tmp3$shape_en == "triangle"], "NA")
                    ))
    ) %>%
    dplyr::select(
      c("subjectIndex", # 被试ID
        "subjectSex", # 被试性别
        "subjectBirth", # 被试出生年份
        "subjectAge", # 被试年龄
        "subjectEdu", # 被试学历
        "time_stamp" , # 该试次进行反应的Unix时间戳
        "subjectStiGroup", # 图形和单词的分组
        "block_id", # block的ID
        "block_type", # block的类别，有练习和正式实验
        "trial_id", # 试次在block下的ID
        "trial_type_num", # 试次循环，1为第一次循环
        "label_en", # 呈现的文字
        "shape_en", # 呈现的图形
        "valence", # 匹配的情况下，图形对应的文字
        "match", # 匹配与否
        "correctRp", # 正确反应按键，非被试反应按键
        "response", # 被试所呈现的反应
        "rt", # 反应时
        "acc" # 反应是否正确，1为正确
        )
    )
  # 将筛选过的Data，给予df.M
  if (exists("df.M")) {
    df.M <- rbind(df.M, tmp2Data)
  } else {
    df.M <- tmp2Data
  }
}
rm(list = ls()[ls() != "df.M"])
write.csv(df.M, file="tmp.csv", row.names = F)

# 计算基本信息
df.M.basic <- df.M %>% 
  dplyr::select(subjectIndex, subjectSex, subjectAge, subjectBirth, subjectEdu, subjectStiGroup) %>% 
  dplyr::distinct(subjectIndex, subjectSex, subjectAge) %>% 
  dplyr::summarise(subj_N = length(subjectIndex),
                   female_N = sum(subjectSex == 'female'),
                   male_N = sum(subjectSex == 'male'),
                   Age_mean = round(mean(subjectAge),2),
                   Age_sd   = round(sd(subjectAge),2)
                   )

# 计算Dprime
df.M.Dprime <- df.M %>% 
  dplyr::mutate(
    hit = ifelse(acc == 1 & match == "match", 1, 0),
    cr = ifelse(acc == 1 & match != "match", 1, 0),
    miss = ifelse(acc == 0 & match == "match", 1, 0),
    fa = ifelse(acc == 0 & match != "match", 1, 0)
  ) %>% 
  dplyr::group_by(
    subjectIndex, valence
  ) %>% 
  dplyr::summarise(
    rt = mean(as.integer(rt), na.rm = T),
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
  dplyr::group_by(
    subjectIndex, valence, match
  ) %>% 
  dplyr::summarise(
    rt = mean(as.integer(rt), na.rm = T)
  )

# 开始传统的重复测量方差分析
resultDprime <-  aov(dPrime ~ valence + Error(subjectIndex/(valence)), df.M.Dprime) %>% 
  summary()
resultRT <-  aov(rt ~ valence * match + Error(subjectIndex/(valence + match)), df.M.RT) %>% 
  summary()

# 贝叶斯的分析
library(BayesFactor)

# RT 反应时
df.M.RT.By <- as.data.frame(df.M.RT)

df.M.RT.By$subjectIndex <- factor(df.M.RT.Ba$subjectIndex)
df.M.RT.By$valence <- factor(df.M.RT.Ba$valence)
df.M.RT.By$match <- factor(df.M.RT.Ba$match)

bf = anovaBF(rt ~ valence * match + subjectIndex, data = df.M.RT.By, 
             whichRandom="subjectIndex")






