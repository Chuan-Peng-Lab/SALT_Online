class GitHub {
    constructor(config) {
        this.owner = config["owner"] ? config["owner"] : "";
        this.repo = config["repo"] ? config["repo"] : "";
        this.path = config["path"] ? config["path"] : "";
        this.token = config["token"] ? config["token"] : "";
        if (this.token.length < 1) {
            this.header = {
                "Content-Type": "application/json"
            }
        } else {
            this.header = {
                "Content-Type": "application/json",
                "Authorization": `token ${this.token}`
            }
        }
    }
    getID(experID = "", length = 4, suffix = "") {
        let name = `${experID ? experID : ""}`;
        let i = 1;
        while (this.isFileExist(name + i.toString().padStart(length, "0") + suffix + ".csv")) {
            i++
        }
        return i;
    }
    isFileExist(fileName) {
        let res = new XMLHttpRequest();
        res.open(
            "GET",
            `https://api.github.com/repos/${this.owner}/${this.repo}/contents${this.path}/${fileName}`,
            false
        )
        for (let k in this.header) {
            res.setRequestHeader(k, this.header[k]);
        }
        res.send();
        if (res.status == 200) {
            return true;
        } else {
            return false;
        }
    }
    delete(fileName, message) {
        let formd = {
            message: message,
            sha: this.getFileSha(fileName)
        };
        let res = new XMLHttpRequest();
        res.open(
            "DELETE",
            `https://api.github.com/repos/${this.owner}/${this.repo}/contents${this.path}/${fileName}`,
            false
        )
        for (let k in this.header) {
            res.setRequestHeader(k, this.header[k]);
        }
        res.send(JSON.stringify(formd));

        if (res.status >= 400) {
            return false;
        } else {
            return true;
        }
    }
    getFileSha(fileName) {
        let res = new XMLHttpRequest();
        res.open(
            "GET",
            `https://api.github.com/repos/${this.owner}/${this.repo}/contents${this.path}/${fileName}`,
            false
        );
        for (let k in this.header) {
            res.setRequestHeader(k, this.header[k]);
        }
        res.send();
        // console.log(res);
        return JSON.parse(res.responseText)["sha"]
    }
    getLastSha() {
        let res = new XMLHttpRequest();
        res.open(
            "GET",
            `https://api.github.com/repos/${this.owner}/${this.repo}/commits`,
            false
        );
        for (let k in this.header) {
            res.setRequestHeader(k, this.header[k]);
        }
        res.send();
        return JSON.parse(res.responseText)[0].sha;
    }
    update(fileName, message, content) {
        let formd = {
            message: message,
            content: btoa(content),
            sha: this.getFileSha(fileName)
        };
        let res = new XMLHttpRequest();
        res.open(
            "PUT",
            `https://api.github.com/repos/${this.owner}/${this.repo}/contents${this.path}/${fileName}`,
            false
        )
        for (let k in this.header) {
            res.setRequestHeader(k, this.header[k]);
        }
        res.send(JSON.stringify(formd));

        if (res.status >= 400) {
            return false;
        } else {
            return true;
        }
    }
    push(fileName, message, content) {
        let formd = {
            message: message,
            content: btoa(content)
        };
        let res = new XMLHttpRequest();
        res.open(
            "PUT",
            `https://api.github.com/repos/${this.owner}/${this.repo}/contents${this.path}/${fileName}`,
            false
        );
        for (let k in this.header) {
            res.setRequestHeader(k, this.header[k]);
        }
        res.send(JSON.stringify(formd));

        if (res.status >= 400) {
            return false;
        } else {
            return true;
        }
    }
    upload(fileName, message, content) {
        if (this.isFileExist(fileName)) {
            return this.update(fileName, message, content);
        } else {
            return this.push(fileName, message, content);
        }
    }
}