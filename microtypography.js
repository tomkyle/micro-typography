export default class Microtypography {
  constructor(replacementsUrl, options = {}) {
    const defaults = {
      rootSelector: '#replacements',
      successIconSelector: '#successIcon',
      copyButtonSelector: '#copyButton',
      inputTextSelector: '#inputText',
      outputTextSelector: '#outputText'
    };
    const config = Object.assign({}, defaults, options);

    this.replacements = [];
    this.replacementsTable = document.querySelector(config.rootSelector);
    this.successIcon = document.querySelector(config.successIconSelector);
    this.copyButton = document.querySelector(config.copyButtonSelector);
    this.inputTextarea = document.querySelector(config.inputTextSelector);
    this.outputTextarea = document.querySelector(config.outputTextSelector);
    this.inputTextTimeout = null;

    // Initialize the application
    this.loadReplacements(replacementsUrl);
    this.attachEventListeners();
  }


  attachEventListeners() {
    this.inputTextarea.addEventListener("input", this.performSearchAndReplace);
    this.copyButton.addEventListener("click", this.copyToClipboard);
  }

  makeid(length) {
    let result = '';
    const characters = 'abcdef0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  loadReplacements(url) {
    // Add random parameter to prevent caching
    const cacheBustUrl = `${url}?${this.makeid(6)}`;

    return fetch(cacheBustUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        this.replacements = data;
        console.table(this.replacements);
        this.renderReplacementTable();
        return data; // Return data for chaining if needed
      })
      .catch(error => {
        console.error("Error loading replacements:", error);
      });
  }

  renderReplacementTable() {
    if (!this.replacementsTable || !this.replacements.length) return;

    const rows = this.replacements.map(element => {
      // Format the search and replace terms for display
      const searchHtml = element.search.replace(/[\u00A0-\u9999<>\&]/gim,
        i => '&#' + i.charCodeAt(0) + ';');

      // Heads up!
      // The regexes may *seem* empty, but they are not. They are non-breaking spaces.
      const replaceHtml = element.replace
        .replace(/ /gim, '<span style="background-color: DeepSkyBlue"> </span>')
        .replace(/ /gim, '<span style="background-color: orange"> </span>');

      return `<tr>
        <td>${element.label}</td>
        <td class="s">${searchHtml}</td>
        <td>${replaceHtml}</td>
      </tr>`;
    }).join('');

    const tbody = this.replacementsTable.querySelector('tbody');
    tbody.innerHTML = rows;
  }

  performSearchAndReplace = () => {
    if (this.inputTextTimeout) {
      clearTimeout(this.inputTextTimeout);
    }

    this.inputTextTimeout = setTimeout(() => {
      var inputText = this.inputTextarea.value;
      var outputText = inputText;

      // Apply each search-and-replace operation
      this.replacements.forEach((replacement) => {
        let r = new RegExp(replacement.search, "gim");
        let _ot = outputText;
        outputText = outputText.replaceAll(r, replacement.replace);

        if (_ot !== outputText) {
          console.info("Applied replacement '" + replacement.label + "'");
        }
      });

      // Update the output code
      this.outputTextarea.value = outputText;
      this.successIcon.classList.remove("visible");
    }, 500);
  }

  copyToClipboard = async () => {
    const outputText = this.outputTextarea.value;

    try {
      // Use the modern Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(outputText);
      } else {
        // Fallback to the deprecated execCommand for older browsers
        const tempTextarea = document.createElement("textarea");
        tempTextarea.value = outputText;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        const success = document.execCommand("copy");
        document.body.removeChild(tempTextarea);

        if (!success) {
          throw new Error("Copy command was unsuccessful");
        }
      }

      // Show the success icon
      this.successIcon.classList.add("visible");
      setTimeout(() => {
        this.successIcon.classList.remove("visible");
      }, 1500);

    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  }

}
