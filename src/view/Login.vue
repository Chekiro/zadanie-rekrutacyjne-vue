<script setup lang="ts">
import userList from "../data/Users";
import { ref } from "vue";
import { useRouter } from "vue-router";

const inputUsername = ref("");
const inputPassword = ref("");
const errorMessage = ref("");
const router = useRouter();

const handleLogin = () => {
  const username = inputUsername.value;
  const password = inputPassword.value;
  const user = userList.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    localStorage.setItem("userId", user.id.toString());
    router.push("/home");
  } else {
    errorMessage.value = "Wrong password or username , try again";
  }
};
</script>
<template>
  <div class="container">
    <div class="vh-100">
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div class="card shadow-2-strong" style="border-radius: 1rem">
              <div class="card-body p-5">
                <p v-if="errorMessage" class="error-message">
                  {{ errorMessage }}
                </p>
                <h3 class="mb-5">Sign in</h3>

                <div class="form-outline mb-4">
                  <label for="inputUsername" class="form-label">Username</label>
                  <input
                    v-model="inputUsername"
                    placeholder="Enter username..."
                    type="text"
                    id="inputUsername"
                    class="form-control form-control-lg"
                  />
                </div>

                <div class="form-outline mb-4">
                  <label for="inputPassword" class="form-label">Password</label>
                  <input
                    v-model="inputPassword"
                    placeholder="Enter password..."
                    type="password"
                    id="inputPassword"
                    class="form-control form-control-lg"
                  />
                </div>
                <button
                  @click="handleLogin"
                  class="btn btn-primary btn-lg"
                  type="submit"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  padding-right: auto;
  padding-left: auto;
}
.error-message {
  color: red;
  font-weight: bold;
}
</style>
