// export const LANGUAGE_VERSIONS = {
//   javascript: "18.15.0",
//   typescript: "5.0.3",
//   python: "3.10.0",
//   java: "15.0.2",
//   csharp: "6.12.0",
//   php: "8.2.3",
// };

// export const CODE_SNIPPETS = {
//   javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
//   typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
//   python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
//   java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
//   csharp:
//     'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
//   php: "<?php\n\n$name = 'Alex';\necho $name;\n",
// };


// constants.js

export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",   // Node.js
  typescript: "5.0.3",     // Node.js
  python: "3.10.0",
  python2: "2.7.18",
  java: "15.0.2",
  csharp: "6.12.0",        // Mono runtime
  php: "8.2.3",
  ruby: "3.0.1",
  go: "1.16.2",
  kotlin: "1.8.20",
  swift: "5.3.3",
  rust: "1.68.2",
  c: "10.2.0",
  "c++": "10.2.0",
  dart: "2.19.6",
  scala: "3.2.2",
  rscript: "4.1.1",        // R
  julia: "1.8.5",
  lua: "5.4.4",
  haskell: "9.0.1",
  perl: "5.36.0",
  bash: "5.2.0",
  sqlite3: "3.36.0"
};

export const CODE_SNIPPETS = {
  javascript: `\nconsole.log("Hello, Alex!");\n`,
  typescript: `\nfunction greet(name: string) {\n  console.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
  python: `\ndef greet(name):\n    print("Hello, " + name + "!")\n\ngreet("Alex")\n`,
  python2: `\ndef greet(name):\n    print "Hello, " + name + "!"\n\ngreet("Alex")\n`,
  java: `\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Alex!");\n  }\n}\n`,
  csharp: `\nusing System;\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello, Alex!");\n  }\n}\n`,
  php: `<?php\n\n$name = "Alex";\necho "Hello, $name!";\n`,
  ruby: `\ndef greet(name)\n  puts "Hello, #{name}!"\nend\n\ngreet("Alex")\n`,
  go: `\npackage main\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, Alex!")\n}\n`,
  kotlin: `\nfun main() {\n  println("Hello, Alex!")\n}\n`,
  swift: `\nprint("Hello, Alex!")\n`,
  rust: `\nfn main() {\n  println!("Hello, Alex!");\n}\n`,
  c: `\n#include <stdio.h>\nint main() {\n  printf("Hello, Alex!\\n");\n  return 0;\n}\n`,
  "c++": `\n#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello, Alex!" << endl;\n  return 0;\n}\n`,
  dart: `\nvoid main() {\n  print('Hello, Alex!');\n}\n`,
  scala: `\nobject Main extends App {\n  println("Hello, Alex!")\n}\n`,
  rscript: `\nname <- "Alex"\ncat("Hello,", name, "!\n")\n`,
  julia: `\nname = "Alex"\nprintln("Hello, ", name, "!")\n`,
  lua: `\nlocal name = "Alex"\nprint("Hello, " .. name .. "!")\n`,
  haskell: `\nmain = putStrLn "Hello, Alex!"\n`,
  perl: `\nmy $name = "Alex";\nprint "Hello, $name!\\n";\n`,
  bash: `\nname="Alex"\necho "Hello, $name!"\n`,
  sqlite3: `\nSELECT "Hello, Alex!" AS greeting;\n`
};

