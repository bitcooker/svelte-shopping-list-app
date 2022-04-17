  export function clickEscape(node, callBackFunction) {
    const handleKey = (event) => {
      if (
        event.key === "Escape" 
      )
      callBackFunction();
    };

    node.addEventListener("keydown", handleKey);

    return {
      destroy() {
        node.removeEventListener("keydown", handleKey);
      },
    };
  }


