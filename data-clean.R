# import image folder
files <- list.files(path = "/Users/marielpacada/baybayin-recognition/baybayin-images", 
                    pattern = "*.jpg", full.names=TRUE)

# parse file name to only include character label
baybayin_labels <- c()
for (i in 1:length(files)) { 
  path <- strsplit(files[i], "-images/")[[1]][2]
  name <- strsplit(path, "-")[[1]][1]
  label <- substr(name, 1, nchar(name) - 5)
  baybayin_labels <- c(baybayin_labels, label)
}

# export labels as csv
write.csv(baybayin_labels,"/Users/marielpacada/baybayin-recognition/baybayin-labels.csv", 
          row.names = FALSE)