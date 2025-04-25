cmake_minimum_required(VERSION 3.10)  # 🔁 Uppdatera för att undvika CMake warning
project(DriveProject)

# C++11
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# ✅ Include paths
include_directories(${CMAKE_SOURCE_DIR}/src)
include_directories(${CMAKE_SOURCE_DIR}/test/mocks)

# 🧱 Build Drive library
add_library(Drive STATIC
    src/Calculations/Drive.cpp
)

# 🧪 Pull in GoogleTest (assumes you have external/googletest checked out)
add_subdirectory(external/googletest)

# 🧪 Enable CTest
enable_testing()

# ⚙️ Build test executable
add_executable(drive_test
    test/drive_test.cpp
)

# ✅ Use mock instead of real MotorController
target_compile_definitions(drive_test PRIVATE TEST_ENVIRONMENT)

# 🔗 Link Drive + GTest
target_link_libraries(drive_test
    PRIVATE
        Drive
        GTest::gtest_main
)

# 🧪 Register test with CTest
add_test(
    NAME DriveTests
    COMMAND drive_test
)