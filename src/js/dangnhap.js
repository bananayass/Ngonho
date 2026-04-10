function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const eyeIcon = document.getElementById(`eye-icon-${fieldId}`);
    if (field && eyeIcon) {
        if (field.type === "password") {
            field.type = "text";
            eyeIcon.classList.remove("ri-eye-line");
            eyeIcon.classList.add("ri-eye-off-line");
        } else {
            field.type = "password";
            eyeIcon.classList.remove("ri-eye-off-line");
            eyeIcon.classList.add("ri-eye-line");
        }
    } else {
        console.error(`Field or eye icon not found for ID: ${fieldId}`);
    }
}

function saveUser(user) {
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    console.log("User saved:", user);
}

function isEmailTaken(email) {
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    return users.some(user => user.email === email);
}

function checkLogin(email, password) {
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    return users.find(user => user.email === email && user.password === password);
}

function handleSignup() {
    const form = document.querySelector("form");
    if (!form) {
        console.error("Form not found for signup");
        return;
    }

    const oldSubmitHandler = form.handleSignupSubmit;
    if (oldSubmitHandler) {
        form.removeEventListener("submit", oldSubmitHandler);
    }

    form.handleSignupSubmit = function (e) {
        e.preventDefault();
        const username = document.getElementById("username");
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirm-password");

        if (!username || !email || !password || !confirmPassword) {
            console.error("One or more signup fields not found:", { username, email, password, confirmPassword });
            alert("\u274c xảy ra lỗi! Vui lòng kiểm tra lại form.");
            return;
        }

        const usernameValue = username.value.trim();
        const emailValue = email.value.trim();
        const passwordValue = password.value;
        const confirmPasswordValue = confirmPassword.value;

        if (passwordValue !== confirmPasswordValue) {
            alert("\u274c Mật khẩu không khớp!");
            return;
        }

        if (isEmailTaken(emailValue)) {
            alert("\u274c Email đã được sử dụng!");
            return;
        }

        saveUser({ username: usernameValue, email: emailValue, password: passwordValue });
        alert("\u2705 Đăng ký thành công! Vui lòng đăng nhập...");
        console.log("Attempting to redirect to signin.html");
        window.location.replace("signin.html");
        console.log("Redirect to signin.html initiated");
    };
    form.addEventListener("submit", form.handleSignupSubmit);
    console.log("Signup event listener attached");
}

function handleSignin() {
    const form = document.querySelector("form");
    if (!form) {
        console.error("Form not found for signin");
        return;
    }

    const checkbox = document.getElementById("remember-me");
    if (checkbox) {
        const oldCheckboxHandler = checkbox.handleCheckboxClick;
        if (oldCheckboxHandler) {
            checkbox.removeEventListener("click", oldCheckboxHandler);
        }
        checkbox.handleCheckboxClick = function () {
            this.classList.toggle("checked");
        };
        checkbox.addEventListener("click", checkbox.handleCheckboxClick);
    }

    const oldSigninHandler = form.handleSigninSubmit;
    if (oldSigninHandler) {
        form.removeEventListener("submit", oldSigninHandler);
    }

    form.handleSigninSubmit = function (e) {
        e.preventDefault();
        const email = document.getElementById("email");
        const password = document.getElementById("password");

        if (!email || !password) {
            console.error("Email or password field not found");
            alert("\u274c xảy ra lỗi! Vui lòng kiểm tra lại form.");
            return;
        }

        const emailValue = email.value.trim();
        const passwordValue = password.value;

        const user = checkLogin(emailValue, passwordValue);
        if (user) {
            alert(`\u2705 Đăng nhập thành công! Chào ${user.username}.`);
            console.log("Attempting to redirect to main.html");
            window.location.replace("main.html");
            console.log("Redirect to main.html initiated");
        } else {
            alert("\u274c Sai email hoặc mật khẩu!");
        }
    };
    form.addEventListener("submit", form.handleSigninSubmit);
    console.log("Signin event listener attached");
}

function handleForgotPassword() {
    const form = document.querySelector("form");
    if (!form) {
        console.error("Form not found for forgot password");
        return;
    }

    const oldSubmitHandler = form.handleForgotPasswordSubmit;
    if (oldSubmitHandler) {
        form.removeEventListener("submit", oldSubmitHandler);
    }

    form.handleForgotPasswordSubmit = function (e) {
        e.preventDefault();
        const username = document.getElementById("username");
        const email = document.getElementById("email");
        const code = document.getElementById("code");
        const newPassword = document.getElementById("new-password");
        const confirmPassword = document.getElementById("confirm-password");

        if (!username || !email || !code || !newPassword || !confirmPassword) {
            console.error("One or more forgot password fields not found:", { username, email, code, newPassword, confirmPassword });
            alert("\u274c xảy ra lỗi! Vui lòng kiểm tra lại form.");
            return;
        }

        const usernameValue = username.value.trim();
        const emailValue = email.value.trim();
        const codeValue = code.value.trim();
        const newPasswordValue = newPassword.value;
        const confirmPasswordValue = confirmPassword.value;

        if (newPasswordValue !== confirmPasswordValue) {
            alert("\u274c Mật khẩu mới không khớp!");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users") || "[]");
        const userIndex = users.findIndex(user => user.email === emailValue && user.username === usernameValue);
        if (userIndex === -1) {
            alert("\u274c Không tìm thấy người dùng!");
            return;
        }

        // Simulate code verification (in a real app, verify code with backend)
        users[userIndex].password = newPasswordValue;
        localStorage.setItem("users", JSON.stringify(users));
        alert("\u2705 Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
        console.log("Attempting to redirect to signin.html");
        window.location.replace("signin.html");
        console.log("Redirect to signin.html initiated");
    };
    form.addEventListener("submit", form.handleForgotPasswordSubmit);
    console.log("Forgot password event listener attached");
}

function sendCode() {
    const email = document.getElementById("email");
    if (!email) {
        console.error("Email field not found");
        alert("\u274c Vui lòng nhập email!");
        return;
    }

    const emailValue = email.value.trim();
    if (!emailValue) {
        alert("\u274c Vui lòng nhập email!");
        return;
    }

    if (!isEmailTaken(emailValue)) {
        alert("\u274c Email không tồn tại!");
        return;
    }

    alert("\u2705 Mã xác nhận đã được gửi đến " + emailValue);
}