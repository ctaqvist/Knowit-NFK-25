cmake_minimum_required(VERSION 3.10)
project(DriveProject)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Definiera TEST_ENVIRONMENT som en CMake‐option
option(TEST_ENVIRONMENT "Build for test environment (mock Arduino hardware)" ON)

# Alltid med i sökvägar
include_directories(${CMAKE_SOURCE_DIR}/src)
include_directories(${CMAKE_SOURCE_DIR}/test/mocks)

if(TEST_ENVIRONMENT)
  message(STATUS ">>> Configuring for TEST environment (no Arduino)")

  # Bygg biblioteket med BARA Drive.cpp
  add_library(Drive STATIC
    src/Calculations/Drive.cpp
  )

  # Definiera TEST_ENVIRONMENT också för Drive‐target
  target_compile_definitions(Drive PRIVATE TEST_ENVIRONMENT)

  # Dra in googletest & enable testing
  add_subdirectory(external/googletest)
  enable_testing()

  # Test‐exekverbar (inkludera också stubben med global instans)
  add_executable(drive_test
    test/drive_test.cpp
    test/mocks/MockGlobal.cpp
  )

  target_compile_definitions(drive_test PRIVATE TEST_ENVIRONMENT)
  target_link_libraries(drive_test
    PRIVATE
      Drive
      GTest::gtest_main
  )

  add_test(NAME DriveTests COMMAND drive_test)

else()
  message(STATUS ">>> Configuring for REAL Arduino environment")

  # Bygg biblioteket med både Drive.cpp och MotorController.cpp
  add_library(Drive STATIC
    src/Calculations/Drive.cpp
    src/Hardware/Motor/MotorController.cpp
  )

endif()
