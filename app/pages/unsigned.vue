<template>
    <div class="bg">
        <img src="/img/bg/cat-eating-chips-windows-xp-meme.gif" alt="background" class="bg-img" />

        <div class="form-container">
            <main class="auth">
                <!-- Toggle header -->
                <div class="toggle-log-regis" @click="lognreg = !lognreg">
                    <div v-if="lognreg" class="lognreg-header">
                        <h1>LOGIN</h1>
                        <p>Click here to change to register</p>
                    </div>
                    <div v-else class="lognreg-header">
                        <h1>REGISTER</h1>
                        <p>Click here to change to login</p>
                    </div>
                </div>

                <div class="err" v-if="err">{{ err }}</div>

                <!-- One form, switches based on 'lognreg' -->
                <form @submit.prevent="go">
                    <template v-if="!lognreg">
                        <!-- show name field only in register mode -->
                        <input class="input" v-model="name" placeholder="Name (optional)">
                    </template>

                    <input class="input" v-model.trim="email" type="email" placeholder="Email" required>
                    <input class="input" v-model="password" type="password" placeholder="Password" required>

                    <div class="login-btn-container">
                        <button type="submit">
                            <span>{{ lognreg ? 'LOGIN' : 'CREATE ACCOUNT' }}</span>
                        </button>
                    </div>
                </form>

                <div class="register-container">
                    <p v-if="lognreg">
                        New here?
                        <a href="#" @click.prevent="lognreg = false">Create account</a>
                    </p>
                    <p v-else>
                        Have an account?
                        <a href="#" @click.prevent="lognreg = true">Login</a>
                    </p>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
const lognreg = ref(true) // true = login, false = register
const name = ref('')
const email = ref('')
const password = ref('')
const err = ref('')

const { login, register, hydrate } = useAuth()
definePageMeta({ layout: 'unsignin' })

onMounted(() => hydrate())

const go = async () => {
    err.value = ''
    try {
        if (lognreg.value) {
            // LOGIN
            await login(email.value, password.value)
        } else {
            // REGISTER
            await register(email.value, password.value, name.value || undefined)
        }
        return navigateTo('/')
    } catch (e: any) {
        err.value = e?.message || (lognreg.value ? 'Login failed' : 'Registration failed')
    }
}
</script>

<style scoped>

.lognreg-header p{
    font-size: 0.5rem;
}

.toggle-log-regis {
    cursor: pointer;
    margin: 0.5px;
    border: #000 solid 2px;
    border-radius: 8px;
    transition: all 0.3s ease-in-out;
}

.toggle-log-regis:hover {
    transform: scale(1.05);
}

.toggle-log-regis:active {
    transform: scale(0.95);
    transition: all 0.1s ease-in-out;
    background-color: #c5c5c5;
}

.err {
    color: red;
    margin-top: 0.5rem;
}

.register-container a {
    color: #000;
    text-decoration: underline;
    cursor: pointer;
}

.input {
    max-width: 190px;
    padding: 0.875rem;
    font-size: 1rem;
    border: 1.5px solid #000;
    border-radius: 0.5rem;
    box-shadow: 2.5px 3px 0 #000;
    outline: none;
    transition: ease 0.25s;
}

.input:focus {
    box-shadow: 5.5px 7px 0 black;
}

.register-container {
    margin-top: 1rem;
    font-size: 0.9rem;
}

.login-btn-container {
    margin-top: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

button {
    display: flex;
    justify-content: center;
    padding: 0.1em 0.25em;
    width: 13em;
    height: 4.2em;
    background-color: #fff;
    border: 0.08em solid #000;
    border-radius: 0.3em;
    font-size: 12px;
    cursor: pointer;
}

button span {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 0.4em;
    width: 12em;
    height: 3.25em;
    background-color: #fff;
    border-radius: 0.2em;
    font-size: 1.1em;
    color: #000;
    border: 0.08em solid #000;
    box-shadow: 0 0.4em 0.1em 0.019em #000;
}

button span:active {
    transition: all 0.3s;
    transform: translate(0, 0.4em);
    background-color: #c5c5c5;
    box-shadow: 0 0 0 0 #fff;
}

button span:not(active) {
    transition: all 0.5s;
}

.bg {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

.bg-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
}

.form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.auth {
    text-align: center;
    max-width: 400px;
    padding: 2rem;
    border: 2px solid #000;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    filter: blur(2px);
    opacity: 0.5;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease-in-out;
    transform: scale(0.9);
}

.auth:hover {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
}

.auth form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
    opacity: 1;
}

@keyframes insertfrombelow {
    0% {
        opacity: 0;
        transform: translateY(50px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
