// CodeEditor.jsx
import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Box,
  HStack,
  VStack,
  Button,
  IconButton,
  Text,
  Heading,
  Divider,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
} from "@chakra-ui/react";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  ExternalLinkIcon,
  ViewIcon,
  RepeatIcon,
  UnlockIcon,
} from "@chakra-ui/icons";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";

/**
 * Enhanced CodeEditor
 *
 * Features added / upgraded:
 * - Open folder (replace project) and Import folder into a selected folder (merge)
 * - Recursively read folder structure using File System Access API and preserve file handles
 * - New file / New folder / Rename / Delete / Save (single file) / Save All
 * - Keyboard shortcuts: Ctrl/Cmd+S = Save, Ctrl/Cmd+Shift+S = Save All, Ctrl/Cmd+P = Toggle Preview
 * - Live preview that intelligently inlines/combines HTML, CSS and JS:
 *    - If index.html exists it will inline linked CSS and JS (by filename match)
 *    - If not, a single-file .js will be wrapped into an HTML template
 *    - Any unreferenced CSS/JS files in the project will be combined and injected
 * - Uses localStorage as fallback when File System Access API / handles are not available
 *
 * NOTE: This component intentionally keeps the `Output` usage unchanged so your execution flow
 * remains the same.
 */

/* ----------------------------- Utilities ----------------------------- */

const defaultProject = [
  {
    name: "index.html",
    type: "file",
    path: "index.html",
    content:
      '<!doctype html>\n<html>\n  <head>\n    <meta charset="utf-8">\n    <title>Preview</title>\n    <link rel="stylesheet" href="styles.css">\n  </head>\n  <body>\n    <h1>Hello, Alex!</h1>\n    <script src="script.js"></script>\n  </body>\n</html>\n',
    handle: null,
  },
  {
    name: "styles.css",
    type: "file",
    path: "styles.css",
    content: "body{font-family:Arial, Helvetica, sans-serif;background:#111;color:#ecf0f1;}h1{color:#8be9fd;}",
    handle: null,
  },
  {
    name: "script.js",
    type: "file",
    path: "script.js",
    content: "console.log('Hello from script.js');",
    handle: null,
  },
];

const buildPath = (parentPath, name) => (parentPath ? `${parentPath}/${name}` : name);

const extToLanguage = (filename = "") => {
  const ext = filename.split(".").pop().toLowerCase();
  const map = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    py2: "python2",
    java: "java",
    cs: "csharp",
    cpp: "c++",
    c: "c",
    rs: "rust",
    go: "go",
    kt: "kotlin",
    kts: "kotlin",
    swift: "swift",
    rb: "ruby",
    php: "php",
    dart: "dart",
    scala: "scala",
    r: "rscript",
    jl: "julia",
    lua: "lua",
    hs: "haskell",
    pl: "perl",
    sh: "bash",
    bash: "bash",
    sql: "sqlite3",
    html: "html",
    htm: "html",
    css: "css",
    json: "json",
    xml: "xml",
    txt: "text",
  };
  return map[ext] || "javascript";
};

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

const findNode = (nodes, path) => {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.type === "folder" && node.children) {
      const found = findNode(node.children, path);
      if (found) return found;
    }
  }
  return null;
};

const findFiles = (nodes, predicate, out = []) => {
  for (const n of nodes) {
    if (n.type === "file" && predicate(n)) out.push(n);
    if (n.type === "folder" && n.children) findFiles(n.children, predicate, out);
  }
  return out;
};

const collectAllFiles = (nodes, out = []) => {
  for (const n of nodes) {
    if (n.type === "file") out.push(n);
    if (n.type === "folder" && n.children) collectAllFiles(n.children, out);
  }
  return out;
};

const updateNodeContent = (nodes, path, cb) => {
  return nodes.map((n) => {
    if (n.path === path) return cb(n);
    if (n.type === "folder" && n.children) return { ...n, children: updateNodeContent(n.children, path, cb) };
    return n;
  });
};

const removeNodeByPath = (nodes, path) => {
  const out = [];
  for (const n of nodes) {
    if (n.path === path) continue;
    if (n.type === "folder") {
      out.push({ ...n, children: removeNodeByPath(n.children || [], path) });
    } else out.push(n);
  }
  return out;
};

const insertNodeAtParent = (nodes, parentPath, newNode) => {
  if (!parentPath) return [...nodes, newNode];
  return nodes.map((n) => {
    if (n.path === parentPath && n.type === "folder") {
      return { ...n, children: [...(n.children || []), newNode] };
    }
    if (n.type === "folder" && n.children) {
      return { ...n, children: insertNodeAtParent(n.children, parentPath, newNode) };
    }
    return n;
  });
};

/* ----------------------------- Component ----------------------------- */

const CodeEditor = () => {
  const editorRef = useRef();
  const toast = useToast();

  const [project, setProject] = useState(() => {
    try {
      const saved = localStorage.getItem("ide_project_v2");
      return saved ? JSON.parse(saved) : defaultProject;
    } catch (e) {
      return defaultProject;
    }
  });

  const [selectedPath, setSelectedPath] = useState(() => {
    // choose first file
    const files = collectAllFiles(project);
    return files.length ? files[0].path : project[0]?.path;
  });

  const [value, setValue] = useState(() => {
    const f = findNode(project, selectedPath);
    return (f && f.content) || "";
  });

  const [language, setLanguage] = useState(() => {
    const f = findNode(project, selectedPath);
    return f ? extToLanguage(f.name) : "javascript";
  });

  const [dirHandle, setDirHandle] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(true);

  /* --------------------------- Persistence --------------------------- */
  useEffect(() => {
    try {
      const serializable = JSON.parse(JSON.stringify(project, (k, v) => (k === "handle" ? undefined : v)));
      localStorage.setItem("ide_project_v2", JSON.stringify(serializable));
    } catch (e) {
      // ignore
    }
  }, [project]);

  /* ------------------------ Update when select changes ------------------------ */
  useEffect(() => {
    const node = findNode(project, selectedPath);
    if (node) {
      setValue(node.content ?? CODE_SNIPPETS[extToLanguage(node.name)] ?? "");
      setLanguage(extToLanguage(node.name));
    }
  }, [selectedPath, project]);

  /* ----------------------------- Editor mount ----------------------------- */
  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelectLanguage = (lang) => {
    setLanguage(lang);
    // if file empty, populate snippet
    if (!value || value.trim() === "") {
      const snippet = CODE_SNIPPETS[lang] || "";
      setValue(snippet);
      setProject((p) => updateNodeContent(p, selectedPath, (n) => ({ ...n, content: snippet })));
    }
  };

  /* ------------------------------- File I/O ------------------------------ */

  // Recursively read directory and return nodes. basePath is used to prefix paths (useful for importing into a folder)
  const readDir = async (dirHandleParam, basePath = "") => {
    const children = [];
    for await (const [name, entry] of dirHandleParam.entries()) {
      const path = buildPath(basePath, name);
      if (entry.kind === "file") {
        try {
          const file = await entry.getFile();
          const text = await file.text();
          children.push({ name, type: "file", path, content: text, handle: entry });
        } catch (e) {
          children.push({ name, type: "file", path, content: "", handle: entry });
        }
      } else if (entry.kind === "directory") {
        const inner = await readDir(entry, path);
        children.push({ name, type: "folder", path, children: inner, handle: entry });
      }
    }
    return children;
  };

  // Open folder and replace project, or import into selected folder (merge)
  const handleOpenFolder = async (options = { importIntoSelected: false }) => {
    if (!window.showDirectoryPicker) {
      toast({ title: "File System Access API not supported", status: "warning", isClosable: true });
      return;
    }
    try {
      const handle = await window.showDirectoryPicker();
      if (!handle) return;
      setDirHandle(handle);

      const basePath = options.importIntoSelected ? selectedPath && findNode(project, selectedPath)?.type === "folder" ? selectedPath : "" : "";
      const treeChildren = await readDir(handle, basePath);

      if (!options.importIntoSelected) {
        // replace project
        setProject(treeChildren.length ? treeChildren : []);
        if (treeChildren.length) setSelectedPath(treeChildren[0].path);
        toast({ title: "Folder opened (replaced project)", status: "success", isClosable: true });
      } else {
        // import: merge treeChildren into selected folder
        if (!basePath) {
          // no selected folder -> append to root
          setProject((prev) => [...prev, ...treeChildren]);
          toast({ title: "Folder imported at root", status: "success", isClosable: true });
        } else {
          // insert under parent path
          setProject((prev) => {
            // find selectedPath node, ensure it's a folder; if it's a file replace with a folder
            const node = findNode(prev, basePath);
            if (!node) {
              // fallback append
              return [...prev, ...treeChildren];
            }
            // if selected is a file, create a folder with that filename? better to insert into its parent
            if (node.type === "file") {
              // put under parent folder
              const parentPath = basePath.includes("/") ? basePath.replace(/\/[^/]*$/, "") : "";
              return insertNodeAtParent(prev, parentPath, { name: "imported", type: "folder", path: buildPath(parentPath, "imported"), children: treeChildren });
            }
            // selected is folder -> merge children into it
            return prev.map((n) => {
              if (n.path === basePath && n.type === "folder") {
                return { ...n, children: [...(n.children || []), ...treeChildren] };
              }
              if (n.type === "folder" && n.children) {
                return { ...n, children: insertNodeAtParent(n.children, basePath, treeChildren).children || insertNodeAtParent(n.children, basePath, treeChildren) };
              }
              return n;
            });
          });
          toast({ title: `Folder imported into "${basePath}"`, status: "success", isClosable: true });
        }
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Folder open canceled or failed", status: "error", isClosable: true });
    }
  };

  // Save current file (writes to disk if handle exists)
  const handleSave = async () => {
    // update in-memory first
    setProject((prev) => updateNodeContent(prev, selectedPath, (n) => ({ ...n, content: value })));
    const node = findNode(project, selectedPath);
    if (node && node.handle && node.handle.createWritable) {
      try {
        const writable = await node.handle.createWritable();
        await writable.write(value);
        await writable.close();
        toast({ title: "Saved to disk", status: "success", isClosable: true });
      } catch (e) {
        console.error(e);
        toast({ title: "Failed to save to disk", status: "error", isClosable: true });
      }
    } else {
      toast({ title: "Saved (localStorage)", status: "success", isClosable: true });
    }
  };

  // Save all files that have handles (and update in-memory for the rest)
  const handleSaveAll = async () => {
    // update in-memory from current editor
    setProject((prev) => updateNodeContent(prev, selectedPath, (n) => ({ ...n, content: value })));
    const files = collectAllFiles(project);
    let savedCount = 0;
    for (const f of files) {
      if (f.handle && f.handle.createWritable) {
        try {
          const writable = await f.handle.createWritable();
          await writable.write(f.content ?? "");
          await writable.close();
          savedCount++;
        } catch (e) {
          console.warn("Failed to save", f.path, e);
        }
      }
    }
    toast({ title: `Saved ${savedCount} files to disk (others saved to localStorage)`, status: "success", isClosable: true });
  };

  const handleNewFile = async (parentPath = "") => {
    const name = prompt("Enter new file name (example: index.html):");
    if (!name) return;
    const path = buildPath(parentPath, name);
    const newNode = { name, type: "file", path, content: CODE_SNIPPETS[extToLanguage(name)] || "", handle: null };
    setProject((prev) => insertNodeAtParent(prev, parentPath, newNode));
    setSelectedPath(path);
    setValue(newNode.content);
    setLanguage(extToLanguage(name));
  };

  const handleNewFolder = async (parentPath = "") => {
    const name = prompt("Enter new folder name:");
    if (!name) return;
    const path = buildPath(parentPath, name);
    const newNode = { name, type: "folder", path, children: [], handle: null };
    setProject((prev) => insertNodeAtParent(prev, parentPath, newNode));
    toast({ title: `Folder "${name}" created`, status: "success", isClosable: true });
  };

  const handleDelete = (path) => {
    if (!confirm(`Delete "${path}" ? This can't be undone.`)) return;
    setProject((prev) => {
      const newp = removeNodeByPath(prev, path);
      if (selectedPath === path) {
        const next = collectAllFiles(newp)[0];
        setSelectedPath(next ? next.path : "");
      }
      return newp;
    });
    toast({ title: "Deleted", status: "info", isClosable: true });
  };

  const handleRename = (path) => {
    const node = findNode(project, path);
    if (!node) return;
    const newName = prompt("New name:", node.name);
    if (!newName || newName === node.name) return;
    const newPath = path.includes("/") ? path.replace(/[^/]*$/, newName) : newName;

    const rewrite = (nodes) =>
      nodes.map((n) => {
        if (n.path === path) {
          const updated = { ...n, name: newName, path: newPath };
          if (n.type === "folder" && n.children) {
            const updateChildrenPaths = (children, oldPrefix, newPrefix) =>
              children.map((c) => {
                const childNewPath = c.path.replace(oldPrefix, newPrefix);
                const updatedChild = { ...c, path: childNewPath };
                if (c.type === "folder") updatedChild.children = updateChildrenPaths(c.children || [], oldPrefix, newPrefix);
                return updatedChild;
              });
            updated.children = updateChildrenPaths(n.children || [], path + "/", newPath + "/");
          }
          return updated;
        }
        if (n.type === "folder" && n.children) {
          return { ...n, children: rewrite(n.children) };
        }
        return n;
      });

    setProject((prev) => rewrite(prev));
    if (selectedPath === path) setSelectedPath(newPath);
    toast({ title: "Renamed", status: "success", isClosable: true });
  };

  const handleFileSelect = (path) => {
    const node = findNode(project, path);
    if (!node) return;
    setSelectedPath(path);
    setValue(node.content ?? CODE_SNIPPETS[extToLanguage(node.name)] ?? "");
    setLanguage(extToLanguage(node.name));
  };

  const handleEditorChange = (val) => {
    setValue(val);
    // update in-memory project node content as user types
    setProject((prev) => updateNodeContent(prev, selectedPath, (n) => ({ ...n, content: val })));
  };

  /* --------------------------- Live preview building --------------------------- */

  const findFileByBasename = (basename) => {
    const all = collectAllFiles(project);
    return all.find((f) => f.name === basename || f.path.endsWith("/" + basename) || f.path === basename);
  };

  const inlineAssetsInHtml = (html) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Inline <link rel="stylesheet" href="...">
      const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
      const inlinedCssNames = new Set();
      for (const link of links) {
        const href = link.getAttribute("href") || "";
        const basename = href.split("/").pop();
        const match = findFileByBasename(basename);
        if (match) {
          const styleEl = doc.createElement("style");
          styleEl.textContent = match.content || "";
          link.replaceWith(styleEl);
          inlinedCssNames.add(match.path);
        }
      }

      // Inline <script src="...">
      const scripts = Array.from(doc.querySelectorAll("script[src]"));
      const inlinedJsNames = new Set();
      for (const scr of scripts) {
        const src = scr.getAttribute("src") || "";
        const basename = src.split("/").pop();
        const match = findFileByBasename(basename);
        if (match) {
          const inlineScript = doc.createElement("script");
          inlineScript.textContent = match.content || "";
          scr.replaceWith(inlineScript);
          inlinedJsNames.add(match.path);
        }
      }

      // After inlining, append any unreferenced CSS files into head
      const allCssFiles = collectAllFiles(project).filter((f) => f.name.toLowerCase().endsWith(".css"));
      const extraCss = allCssFiles.filter((f) => !inlinedCssNames.has(f.path)).map((f) => f.content || "").join("\n\n");
      if (extraCss.trim().length > 0) {
        const styleEl = doc.createElement("style");
        styleEl.textContent = extraCss;
        doc.head.appendChild(styleEl);
      }

      // Append any unreferenced JS files at the end of body
      const allJsFiles = collectAllFiles(project).filter((f) => f.name.toLowerCase().endsWith(".js"));
      const extraJs = allJsFiles.filter((f) => !inlinedJsNames.has(f.path)).map((f) => f.content || "").join("\n\n");
      if (extraJs.trim().length > 0) {
        const scriptEl = doc.createElement("script");
        scriptEl.textContent = extraJs;
        doc.body.appendChild(scriptEl);
      }

      return "<!doctype html>\n" + doc.documentElement.outerHTML;
    } catch (e) {
      // fallback: return original html
      console.warn("Inlining failed", e);
      return html;
    }
  };

  const buildFallbackFromJs = (jsContent) => {
    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>JS Preview</title>
    <style>${collectAllFiles(project).filter((f) => f.name.endsWith(".css")).map((f) => f.content || "").join("\n\n")}</style>
  </head>
  <body>
    <div id="root"></div>
    <script>
${jsContent}
    </script>
  </body>
</html>`;
  };

  const previewSrcDoc = useMemo(() => {
    // If there's an index.html choose it and inline assets
    const indexFile = findFiles(project, (f) => f.name.toLowerCase() === "index.html")[0] || findFiles(project, (f) => f.name.toLowerCase() === "index.htm")[0];
    if (indexFile && indexFile.content) {
      return inlineAssetsInHtml(indexFile.content);
    }

    // If selected is html return its content inlined
    const selectedNode = findNode(project, selectedPath);
    if (selectedNode && selectedNode.name && selectedNode.name.toLowerCase().endsWith(".html")) {
      return inlineAssetsInHtml(selectedNode.content || "");
    }

    // If there is any html file, inline the first one
    const anyHtml = collectAllFiles(project).find((f) => f.name.toLowerCase().endsWith(".html") || f.name.toLowerCase().endsWith(".htm"));
    if (anyHtml) return inlineAssetsInHtml(anyHtml.content || "");

    // If selected js -> wrap
    if (selectedNode && selectedNode.name && selectedNode.name.toLowerCase().endsWith(".js")) {
      return buildFallbackFromJs(selectedNode.content || "");
    }

    // Else if there's any js file, combine with css
    const jsFile = collectAllFiles(project).find((f) => f.name.toLowerCase().endsWith(".js"));
    if (jsFile) return buildFallbackFromJs(jsFile.content || "");

    // No preview available
    return "";
  }, [project, selectedPath]);

  /* --------------------------- Keyboard shortcuts -------------------------- */

  useEffect(() => {
    const handler = (e) => {
      const metaKey = e.ctrlKey || e.metaKey;
      if (!metaKey) return;
      // Save (Ctrl/Cmd+S)
      if (e.key.toLowerCase() === "s" && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }
      // Save All (Ctrl+Shift+S)
      if (e.key.toLowerCase() === "s" && e.shiftKey) {
        e.preventDefault();
        handleSaveAll();
      }
      // Toggle preview (Ctrl/Cmd+P)
      if (e.key.toLowerCase() === "p" && !e.shiftKey) {
        e.preventDefault();
        setPreviewOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, selectedPath, value]);

  /* ------------------------------- Tree UI -------------------------------- */

  const TreeNode = ({ node, level = 0 }) => {
    const indent = { marginLeft: level * 8 + "px", display: "flex", alignItems: "center" };
    if (node.type === "file") {
      return (
        <Box key={node.path} p="1" _hover={{ bg: "gray.700" }} borderRadius="md">
          <HStack spacing={2} style={indent}>
            <Text
              fontSize="sm"
              cursor="pointer"
              onClick={() => handleFileSelect(node.path)}
              color={selectedPath === node.path ? "green.200" : "gray.200"}
              noOfLines={1}
            >
              {node.name}
            </Text>
            <Tooltip label="Rename" aria-label="rename">
              <IconButton size="xs" aria-label="rename" icon={<EditIcon />} onClick={() => handleRename(node.path)} />
            </Tooltip>
            <Tooltip label="Delete" aria-label="delete">
              <IconButton size="xs" aria-label="delete" icon={<DeleteIcon />} onClick={() => handleDelete(node.path)} />
            </Tooltip>
          </HStack>
        </Box>
      );
    }
    // folder
    return (
      <Box key={node.path} p="1">
        <HStack spacing={2} style={indent}>
          <Text fontWeight="bold" fontSize="sm" noOfLines={1} cursor="pointer" onClick={() => setSelectedPath(node.path)} color={selectedPath === node.path ? "green.200" : "gray.200"}>
            {node.name}/
          </Text>
          <Tooltip label="New file here">
            <IconButton size="xs" aria-label="new-file" icon={<AddIcon />} onClick={() => handleNewFile(node.path)} title="New file inside folder" />
          </Tooltip>
          <Tooltip label="New folder">
            <IconButton size="xs" aria-label="rename" icon={<RepeatIcon />} onClick={() => handleNewFolder(node.path)} title="New folder inside" />
          </Tooltip>
          <Tooltip label="Rename">
            <IconButton size="xs" aria-label="rename" icon={<EditIcon />} onClick={() => handleRename(node.path)} title="Rename folder" />
          </Tooltip>
          <Tooltip label="Delete folder">
            <IconButton size="xs" aria-label="delete-folder" icon={<DeleteIcon />} onClick={() => handleDelete(node.path)} title="Delete folder" />
          </Tooltip>
        </HStack>
        <Box ml="3">
          {(node.children || []).map((c) => (
            <TreeNode key={c.path} node={c} level={level + 1} />
          ))}
        </Box>
      </Box>
    );
  };

  /* ----------------------------- Render UI ------------------------------ */

  return (
    <Box p={4} height="100vh" bg="gray.900" color="gray.100">
      <HStack spacing={4} align="start" height="100%">
        {/* File explorer */}
        <Box w="18%" borderRadius="md" p={3} bg="gray.800" minH="85vh" overflowY="auto">
          <HStack justify="space-between" mb={3}>
            <Heading size="sm">Project</Heading>
            <Menu>
              <MenuButton as={Button} size="sm">
                ⋮
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => handleNewFile("")}>New File (root)</MenuItem>
                <MenuItem onClick={() => handleNewFolder("")}>New Folder (root)</MenuItem>
                <MenuItem onClick={() => handleOpenFolder({ importIntoSelected: false })}>Open Folder (replace)</MenuItem>
                <MenuItem onClick={() => handleOpenFolder({ importIntoSelected: true })}>Import Folder into selected</MenuItem>
                <MenuItem onClick={handleSaveAll}>Save All</MenuItem>
              </MenuList>
            </Menu>
          </HStack>

          <Divider mb={2} />

          <VStack align="stretch" spacing={1}>
            {project.length ? project.map((node) => <TreeNode key={node.path} node={node} level={0} />) : <Text color="gray.400">Project is empty — open or create files.</Text>}
          </VStack>

          <Divider mt={3} />

          <HStack mt={3}>
            <Button size="sm" onClick={() => handleNewFile("")}>
              New File
            </Button>
            <Button size="sm" onClick={() => handleNewFolder("")}>
              New Folder
            </Button>
            <Tooltip label="Open folder (replace)">
              <IconButton size="sm" aria-label="open-folder" title="Open folder" onClick={() => handleOpenFolder({ importIntoSelected: false })} icon={<ExternalLinkIcon />} />
            </Tooltip>
            <Tooltip label="Import folder into selected">
              <IconButton size="sm" aria-label="import-folder" title="Import folder into selected" onClick={() => handleOpenFolder({ importIntoSelected: true })} icon={<UnlockIcon />} />
            </Tooltip>
          </HStack>
        </Box>

        {/* Editor area */}
        <Box w="50%" bg="gray.800" borderRadius="md" p={3} minH="85vh">
          <HStack justify="space-between" mb={2}>
            <LanguageSelector language={language} onSelect={onSelectLanguage} />
            <HStack spacing={2}>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (!selectedPath) return toast({ title: "No file selected", status: "warning", isClosable: true });
                  const parent = selectedPath.includes("/") ? selectedPath.replace(/\/[^/]*$/, "") : "";
                  handleNewFile(parent);
                }}
              >
                New
              </Button>
              <IconButton size="sm" aria-label="save-all" title="Save All" onClick={handleSaveAll} icon={<RepeatIcon />} />
              <IconButton size="sm" aria-label="toggle-preview" title="Toggle preview" onClick={() => setPreviewOpen((v) => !v)} icon={<ViewIcon />} />
            </HStack>
          </HStack>

          <Editor
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              wordWrap: "on",
            }}
            height="75vh"
            theme="vs-dark"
            language={language}
            value={value}
            onMount={onMount}
            onChange={(val) => handleEditorChange(val)}
          />
        </Box>

        {/* Output + Preview */}
        <Box w="32%" bg="gray.800" borderRadius="md" p={3} minH="85vh">
          <Heading size="sm" mb={2}>
            Output
          </Heading>

          <Box mb={3}>
            {/* Output component unchanged — it receives editorRef and language */}
            <Output editorRef={editorRef} language={language} />
          </Box>

          <Divider mb={3} />

          <HStack justify="space-between" mb={2}>
            <Heading size="sm">Live Preview</Heading>
            <Text fontSize="xs" color="gray.300">
              {previewOpen ? "on" : "off"}
            </Text>
          </HStack>

          <Box borderRadius="md" border="1px solid" borderColor="gray.700" h="52vh" overflow="hidden" bg="black">
            {previewOpen ? (
              (() => {
                const srcDoc = previewSrcDoc;
                if (!srcDoc) {
                  return (
                    <Box p={3} color="gray.300">
                      <Text>No preview content available for this project.</Text>
                      <Text fontSize="sm" color="gray.400">
                        Add an index.html or a script.js file to preview, or open a folder containing a web project.
                      </Text>
                    </Box>
                  );
                }
                return (
                  <iframe
                    title="live-preview"
                    srcDoc={srcDoc}
                    style={{ width: "100%", height: "100%", border: 0 }}
                    sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-scripts allow-same-origin"
                  />
                );
              })()
            ) : (
              <Box p={4} color="gray.400">
                <Text>Preview is hidden. Press Ctrl/Cmd+P or click the eye button to enable.</Text>
              </Box>
            )}
          </Box>
        </Box>
      </HStack>
    </Box>
  );
};

export default CodeEditor;
