rm(list = ls()) 
df.M = read_csv("/Users/zhengyuanrui/Asso_Learn_Online/result/df_pilot_online_SALT_open.csv")
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

df.M1 %>%
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
  ) %>% pivot_longer(cols = c(q1,q3,q5,q7,q9), names_to = "q") %>% 
  ggplot(aes(x = a, y = value, group = q)) + geom_point()+ geom_line()

                                                          
                                                                          