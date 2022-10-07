function clearScreen() 
{
    document.getElementById("result").value = "";
}

function clearEntry()
{
    let a = document.getElementById("result").value;
    if(a == '') return;
    else document.getElementById("result").value = a.substring(0, a.length - 1);
}
function display(value) 
{
    document.getElementById("result").value += value;
}

function calculate() 
{
    var input = document.getElementById("result").value;
    var tokensArray = input.split("");
    //document.getElementById("test").textContent = tokensArray;
    var tokens = Splitter(tokensArray); // turn the array of characters into readable tokens
    document.getElementById("test").textContent = tokens; 
    var postFix = inToPost(tokens);
    var answer = evaluate(postFix);

    //document.getElementById("test").textContent = tokensArray; // change "test" to "result"
    document.getElementById("result").value = "";
}

function Splitter(input)
{
    var returnTokens = [];
    var i = 0; // iterate through the array of characters
    var operators = ['+','-','*','/','^'];
    while (i < input.length)
    {
        if(operators.indexOf(input[i]) != -1 && input[i] != '-')
        {
            returnTokens.push(input[i]);
            i++;
        }
        else if(input[i] == '-')
        {
            // checks to determine if it is subtraction or negation
            if(i === 0) // if position 0
            {
                returnTokens.push('neg');
                i++;
            }
            else if(input[i-1] == '(' || input[i-1] == '{') // if the preceeding value is open bracket
            {
                returnTokens.push('neg');
                i++;
            }
            else
            {
                returnTokens.push('-');
                i++;
            }
        }
        else if(input[i] == 's'|| input[i] == 'c'|| input[i] == 't'|| input[i] == 'l')
        {
            // differentiate which type of function is being expressed and properly push to stack
            let a = '';
            if(input[i] == 's')
            {
                
            }
            returnTokens.push(input[i]);
            i++;
        }
        else
        {  
            let a = '';
            while(i < input.length)
            {
                //let a = input[i].toString(); // a variable to hold onto the number until we reach a breaking point
                //a = input[i].toString();
                //i++;
                if (!isNaN(input[i]))
                {
                    a += input[i];
                    i++;
                    continue;
                }
                else if (input[i] == '.')
                {
                    a += input[i];
                    i++;
                    continue;
                }
                else break;
            }

            if(a == '') { i++; continue; }
            else returnTokens.push(a);
            //i++;
        }
    }
    return returnTokens;

}
function inToPost(tokens)
{
    var stack = [], list = [];
    var operators = ['+','-','*','/','^'];
}

function evaluate(tokens)
{
    let iterator = 0;
    while (iterator < tokens.length)
    {
        var currToken = tokens[iterator];

        if (isNum(currToken))
        {
            stack.push(currToken);
        }
        else if (isOperator(currToken))
        {
            var op1 = stack.pop();
            var op2 = stack.pop();

            var result = performOperation(parseInt(op1), parseInt(op2), currToken);
            stack.push(result);
        }
        else if (isFunc(currToken))
        {

        }
        iterator++;
    }
    let a = stack.pop();
    // document.getElementById("result").value = a;
}
function isOperator(token)
{
    if(!token.match(/([*+-\/])/))
        return false;
    else 
        return true;
    
}

function performOperation(op1, op2, operator)
{
    switch (operator)
    {
        case '+':
            return op1 + op2;
        case '-':
            return op1 - op2;
        case '*':
            return op1 * op2;
        case '/':
            return op1 / op2;
        default:
            return;

        /* unary operators
        case 'sin(':
        case 'cos(':
        case 'tan(':
        case 'cot(':
        case 'log':
        case 'ln':
        case '^':
        */ 
    }
}

function isNum(token)
{
    if (token.match(/-?[0-9]+(\.[0-9]+)?/))
        return true;
    else 
        return false;
}
    // Function to acquire the presidence of the operator
function getPres(token)
{
    switch(token)
    {
        case 'neg':
            return 5;
        case '^':
            return 4;
        case '*':
        case '/':
            return 3;
        case '-':
        case '+':
            return 2;
        default:
            return -1;
    }
}

function isFunc(token)
{
    switch(token)
    {
        case 's':
        case 'c':
        case 't':
        case 'l':
            return true;
        default:
            return false;

    }
}

function getAssoc(token)
{
    switch(token)
    {
        case '+':
        case '-':
        case '*':
        case '/':
            return 'left';
        case '^':
        case 'sin':
        case 'cos':
        case 'tan':
        case 'cot':
        case 'ln':
        case 'log':
            return 'right';
    }
}