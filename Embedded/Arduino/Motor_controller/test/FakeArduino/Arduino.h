#pragma once

#define HIGH 0x1
#define LOW  0x0

inline void pinMode(int, int) {}
inline void digitalWrite(int, int) {}
inline void analogWrite(int, int) {}
inline void delay(int) {}
inline void Serial_begin(int) {}
inline void Serial_print(const char* str) {}
inline void Serial_println(const char* str) {}
inline void Serial_println(int val) {}
inline void Serial_println(float val) {}
inline void Serial_println(char* str) {}
inline void Serial_println(unsigned int val) {}
inline void Serial_println(unsigned long val) {}
inline void Serial_println(long val) {}
inline void Serial_println(char val) {}
inline void Serial_println(unsigned char val) {}
inline void Serial_println(int val, int base) {}
inline void Serial_println(float val, int base) {}
inline void Serial_println(double val) {}
inline void Serial_println(char* str, int base) {}
inline void Serial_println(unsigned int val, int base) {}
inline void Serial_println(long val, int base) {}
inline void Serial_println(unsigned long val, int base) {}
inline void Serial_println(char val, int base) {}
inline void millis() {}
inline void Serial_read() {}
inline void Serial_available() {}
inline void Serial_print(int val) {}
inline void Serial_print(float val) {}
inline void Serial_print(char val) {}
inline void Serial_println() {}
