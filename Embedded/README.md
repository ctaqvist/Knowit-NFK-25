# Embedded

## Arduino Code Standard

### Naming Convention
- **Variables** use `camelCase`: the first letter should always be lowercase.  
  Examples: `motorSpeed`, `ledState`.
- **Constants** use `UPPER_CASE_WITH_UNDERSCORES`:  
  Examples: `MAX_SPEED`, `PWM_A`.
- **Functions** use `CamelCase`: should always start with a verb.  
  Examples: `DriveForward`, `StopMotors`. Function names must clearly describe their purpose.
- **Classes/Structs** use `PascalCase`, example: `MotorController`.
- **Members of a class**: private members should start with `lower_case_with_underscore`, and the letter should be the first letter of the class.  
  Example: `m_speed`.

### Functions
- Each function should have a **single responsibility**.
- Keep functions short and modular (preferably under 20 lines of code).
- Mark non-modifying member functions as `const`.

### Comments
- Use `//` for brief comments and `/* */` for blocks.
- Every function must have a short description of its purpose above it.
- Comment only what is **not obvious** – avoid redundant or trivial comments.
- Always have a space after `//` and inside `/* */`.

### Whitespace & Formatting
- Leave one empty line between function definitions.
- Do **not** leave an empty line before `}`.
- Always use `{}` with `if`, `else`, `while`, and `for`, even for one-liners.
- Place opening braces on the same line as control statements or function declarations, and have **one space** between `()` and `{`:

```cpp
void doSomething() {
    // code
}
