setwd("~/Desktop/SALT_Online/4_Analysis/4_1_pre_analysis")
rm(list = ls())
file <- list.files("../../3_RawData/3_2_pretreatment_data")

for (f in file) { # 对于文件进行循环读取
    write(URLdecode(getSrcLines(srcfile(paste("../../3_RawData/3_2_pretreatment_data/", f, sep = "")), 1, 4)), "tmp")
    tmp <- read.csv(
        "tmp",
        header = TRUE, sep = ",", stringsAsFactors = F, encoding = "UTF-8"
    ) # 读取单个csv，并赋予tmp
    unlink("tmp")
    print(f)
    if (exists("raw_data")) {
        raw_data <- rbind(raw_data, tmp)
    } else {
        raw_data <- tmp
    } # 这一步是保存tmp的内容
}
write.csv(raw_data, "../4_1_data/4_1_1_Preprocessing_data/origin.csv")