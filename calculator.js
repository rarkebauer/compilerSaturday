var Calculator = function(inputString){
  this.tokenStream = this.lexer(inputString);
}


Calculator.prototype.lexer = function(inputString){
  var arrOfObj = [];
  var tokenTypes = [
    ["NUMBER",    /^\d+/ ],
    ["ADD",       /^\+/  ],
    ["SUB",       /^\-/  ],
    ["MUL",       /^\*/  ],
    ["DIV",       /^\//  ],
    ["LPAREN",    /^\(/  ],
    ["RPAREN",    /^\)/  ]
  ];
  var num = tokenTypes[0][1];
  var add = tokenTypes[1][1];
  var sub = tokenTypes[2][1];
  var mul = tokenTypes[3][1];
  var div = tokenTypes[4][1];
  var lparen = tokenTypes[5][1];
  var rparen = tokenTypes[6][1];
  for(var i=0; i<inputString.length; i++){
    if(num.exec(parseInt(inputString[i]))){
      arrOfObj.push({name: "NUMBER", value:  ""+inputString[i]+""});

    }
    if(add.exec(inputString[i])){
      arrOfObj.push({name: "ADD", value:  ""+inputString[i]+""})

    }
    if(sub.exec(inputString[i])){
      arrOfObj.push({name: "SUB", value:  ""+inputString[i]+""});

    }
    if(mul.exec(inputString[i])){
      arrOfObj.push({name: "MUL", value:  ""+inputString[i]+""});

    }
    if(div.exec(inputString[i])){
      arrOfObj.push({name: "DIV", value:  ""+inputString[i]+""});

    }
    if(lparen.exec(inputString[i])){
      arrOfObj.push({name: "LPAREN", value:  ""+inputString[i]+""});

    }
    if(rparen.exec(inputString[i])){
      arrOfObj.push({name: "RPAREN", value:  ""+inputString[i]+""});

    }
  }

  return arrOfObj;
};

Calculator.prototype.peek = function() {
  return this.tokenStream[0] || null;
}
Calculator.prototype.get = function() {
  return this.tokenStream.shift();
}

var calc = new Calculator("2+4");


var TreeNode = function(name, ...children) {
  this.name = name;
  this.children = children;
}
var tree = new TreeNode("name", "child1", "child2", "child3");


Calculator.prototype.parseExpression = function () {
  var term = this.parseTerm();
  var a = this.parseA();

  return new TreeNode("Expression", term, a);
};

Calculator.prototype.parseA = function () {
  var nextToken = this.peek();
  if(nextToken && nextToken.name === "ADD") {
    this.get();
    return new TreeNode("A", "+", this.parseTerm(), this.parseA());
  } else if(nextToken && nextToken.name == "SUB") {
    this.get();
    return new TreeNode("A", "-", this.parseTerm(), this.parseA());
  } else {
    return new TreeNode("A")
  }
};

Calculator.prototype.parseB = function () {
  var nextToken = this.peek();
  if(nextToken && nextToken.name === "MUL") {
    this.get();
    return new TreeNode("B", "*", this.parseTerm(), this.parseB());
  } else if(nextToken && nextToken.name == "DIV") {
    this.get();
    return new TreeNode("B", "/", this.parseTerm(), this.parseB());
  } else {
    return new TreeNode("B")
  }
};

Calculator.prototype.parseTerm = function () {
  var factor = this.parseFactor();
  var b = this.parseB();

  return new TreeNode("Term", factor, b);
};

Calculator.prototype.parseFactor= function () {
  if(this.peek().name === "LPAREN") {
    this.get(); // we need this to remove the LPAREN
    var expr = this.parseExpression();
    this.get();
    return new TreeNode("Factor", "(", expr, ")");
  }
};

TreeNode.prototype.accept = function(visitor) {
  return visitor.visit(this);
}

function PrintOriginalVisitor() {
  this.visit = function(node) {
    switch(node.name) {
      case "Expression":
        break;
      case "Term":
        break;
      // etc
    }
  }

function InfixVisitor() {

      this.visit = function(node) {
        switch(node.name) {
          case "Expression":
            return node.children[0].accept(this) + node.children[1].accept(this);
            break;

          case "A":
            if(node.children.length > 0) {
              return  node.children[0] + node.children[1].accept(this) + node.children[2].accept(this);
            } else {
              return "";
            }
            break;
          default:
            break;
        }
      }
    }

function PostfixVisitor() {

        this.visit = function(node) {
          switch(node.name) {
            case "Expression":
              return node.children[0].accept(this) + node.children[1].accept(this);
              break;
            case "Term":
              return node.children[0].accept(this) + node.children[1].accept(this);
              break;
            case "A":
              if(node.children.length > 0) {
                return node.children[1].accept(this) + node.children[2].accept(this) + node.children[0];
              } else {
                return "";
              }
              break;
            case "Factor":
              if(node.children[0] === "(" ){
                return node.children[1].accept(this);
              } else if(node.children[0] ==="-") {
                return "-" + node.children[1].accept(this);
              } else{
                return node.children[0];
              }
              break;
            case "B":
              if(node.children.length > 0) {
                return node.children[1].accept(this) + node.children[2].accept(this) + node.children[0];
              } else {
                return "";
              }
              break;
            default:
              break;
          }
        }
      }




var calc = new Calculator("3+4*5");
var tree = calc.parseExpression()
var printOriginalVisitor = new PrintOriginalVisitor()
console.log(tree.accept(printOriginalVisitor));



// E => T A
// A => + T A
//      - T A
//      epsilon
// T => F B
// B => * F B
//      / F B
//      epsilon
// F => ( E )
//      - F
//      NUMBER
