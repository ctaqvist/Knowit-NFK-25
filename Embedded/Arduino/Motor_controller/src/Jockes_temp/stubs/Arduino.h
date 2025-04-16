#ifndef ARDUINO_H
#define ARDUINO_H

#include <iostream>

class SerialClass {
public:
    void begin(int baud) {
        std::cout << "Serial.begin(" << baud << ")" << std::endl;
    }
    void println(const char* s) {
        std::cout << s << std::endl;
    }
};

extern SerialClass Serial;

#endif