if (exists("df.M")) rm("df.M")
library(tidyverse)

# 注释
# Name优化
# tmpData del

file <- list.files("data")

for (f in file) {
  
  va <- read.csv(paste("data/", f, sep=""), header=TRUE, sep=",", stringsAsFactors = F)
  
  id <- paste("v01", jsonlite::fromJSON(va$responses[2])$Q1, sep="")
  name = jsonlite::fromJSON(va$responses[4])$Q0
  sex = va$response[5]
  birth = jsonlite::fromJSON(va$responses[6])$Q0
  edu = jsonlite::fromJSON(va$responses[7])$Q0
  match = va$sti_match[1]
  mismatch = va$sti_mismatch[1]
  stiType = va$sti_group[1]
  
  tmp3 <- va %>%
    dplyr::filter(
      key == match
    ) %>%
    dplyr::distinct(
      label_en, shape_en
    )
  
  tmp2Data <- va[-1:-7, ] %>%
    dplyr::rename(
      correctRp = key,
      acc = correct
    ) %>%
    dplyr::mutate(
      subjectIndex = id, 
      subjectSex = sex, 
      subjectBirth = birth,
      subjectEdu = edu,
      subjectStiGroup = stiType,
      response = ifelse(key_press == 78, "n", ifelse(key_press == 77, "m", "NA")),
      acc = ifelse(acc == "true", 1, ifelse(acc == "false", 0, "NA")),
      match = ifelse(correctRp == match, "match", "mismatch"),
      Vali = ifelse(shape_en == "square", tmp3$label_en[tmp3$shape_en == "square"],
                    ifelse(shape_en == "circular", tmp3$label_en[tmp3$shape_en == "circular"], 
                           ifelse(shape_en == "triangle", tmp3$label_en[tmp3$shape_en == "triangle"], "NA")
                    ))
    ) %>%
    dplyr::select(
      c("subjectIndex", "subjectSex", "subjectBirth", "subjectEdu", "time_stamp" , "subjectStiGroup", "block_id", "block_type", 
        "trial_id", "trial_type_num", "label_en", "shape_en", "Vali", "match", "correctRp", "response", "rt", "acc")
    )
    
  
  # 78 n
  if (exists("df.M")) {
    df.M <- rbind(df.M, tmp2Data)
  } else {
    df.M <- tmp2Data
  }
}
rm(list = ls()[ls() != "df.M"])
write.csv(df.M, file="tmp.csv", row.names = F)




