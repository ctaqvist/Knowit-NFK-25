cmake_minimum_required(VERSION 3.5)
project(DriveProject)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED True)

include_directories(src/Jockes_temp/stubs)

add_library(Drive STATIC src/Jockes_temp/Drive.cpp)

add_subdirectory(external/googletest)

add_executable(drive_test test/drive_test.cpp)

target_link_libraries(drive_test Drive gtest gtest_main pthread)
