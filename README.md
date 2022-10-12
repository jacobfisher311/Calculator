# Calculator
A basic calculator capable of doing binary and unary operations utilizing a GUI.

To run this calculator: download the source file and leaving the HTML, CSS, and JS code in the same file, run "index.html"

The file can be ran in Windows or MacOS by simply double clicking "index.html" or, if the code is opened in an IDE, run with/without debugging will result in the same execution.

Inputs from the buttons will be displayed on the top display window, and once the user presses the "=" button, the display window will show the solution.

If the input is invalid, there will be a popup window that appears displaying some more information about why the problem did not compute, and provide a button labelled "OK."

If there is an error, and the popup window appears, the display window will clear and the user will have to re-input their equation.

Once the answer for the equation is displayed in the display window, that number can be manipulated by simply adding numbers/operations/functions to what is currently displayed.

C button clears the display window, CE works as a "backspace" clearing the entry from right to left, one character at a time.

Parenthesis "()" and "{}" are interpreted exactly the same, the only difference between the two are visual for the user. 

Multiplication must be explicit. If the user puts 7sin(4) or 7(4) the calculator will throw an error. If the user wants to multiply two numbers, they must use the '*' operator.