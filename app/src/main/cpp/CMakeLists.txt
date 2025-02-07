cmake_minimum_required(VERSION 3.4.1)

add_library(cue2pops SHARED
            cue2pops.c)

target_link_libraries(cue2pops
                     android
                     log)
