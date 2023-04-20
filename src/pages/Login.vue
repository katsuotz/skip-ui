<script setup lang="ts">
import logoUrl from "../assets/images/logo.svg";
import illustrationUrl from "../assets/images/illustration.svg";
import {FormInput} from "../base-components/Form";
import {Field, Form} from 'vee-validate';
import Button from "../base-components/Button";
import {useAuthStore} from "../stores/modules/auth";
import {ref} from "vue";
import {useRouter} from "vue-router";

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')

const handleSubmit = () => {
  authStore.login(username.value, password.value).then(() => {
    router.push('/')
  })
}

</script>

<template>
  <div class="h-screen lg:overflow-hidden">
    <div
      :class="[
        '-m-3 sm:-mx-8 p-3 sm:px-8 relative bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600',
        'before:hidden before:xl:block before:content-[\'\'] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400',
        'after:hidden after:xl:block after:content-[\'\'] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700',
      ]"
    >
      <div class="container relative z-10 sm:px-10">
        <div class="block grid-cols-2 gap-4 xl:grid">
          <!-- BEGIN: Login Info -->
          <div class="flex-col hidden min-h-screen xl:flex">
            <a
              href=""
              class="flex items-center pt-5 -intro-x"
            >
              <img
                alt="Midone Tailwind HTML Admin Template"
                class="w-6"
                :src="logoUrl"
              >
              <span class="ml-3 text-lg text-white"> Rubick </span>
            </a>
            <div class="my-auto">
              <img
                alt=""
                class="w-1/2 -mt-16 -intro-x"
                :src="illustrationUrl"
              >
              <div
                class="mt-10 text-4xl font-medium leading-tight text-white -intro-x"
              >
                A few more clicks to <br>
                sign in to your account.
              </div>
              <div
                class="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400"
              >
                Manage all your e-commerce accounts in one place
              </div>
            </div>
          </div>
          <!-- END: Login Info -->
          <!-- BEGIN: Login Form -->
          <div class="flex h-screen py-5 lg:my-10 xl:h-auto xl:py-0 xl:my-0">
            <div
              class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto"
            >
              <Form
                @submit="handleSubmit"
              >
                <h2
                  class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left"
                >
                  Sign In
                </h2>
                <div class="mt-8 intro-x">
                  <Field
                    v-slot="{ field, errorMessage }"
                    name="Username"
                    rules="required"
                  >
                    <FormInput
                      v-bind="field"
                      v-model.trim="username"
                      type="text"
                      :class="{
                        'block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]': true,
                        'border-danger': errorMessage,
                      }"
                      placeholder="Username"
                    />
                    <div
                      v-show="errorMessage"
                      class="mt-2 text-danger"
                    >
                      {{ errorMessage }}
                    </div>
                  </Field>
                  <Field
                    v-slot="{ field, errorMessage }"
                    name="Password"
                    rules="required"
                  >
                    <FormInput
                      v-bind="field"
                      v-model="password"
                      type="password"
                      :class="{
                        'block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]': true,
                        'border-danger': errorMessage,
                      }"
                      placeholder="Password"
                    />
                    <div
                      v-show="errorMessage"
                      class="mt-2 text-danger"
                    >
                      {{ errorMessage }}
                    </div>
                  </Field>
                </div>
                <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                  <Button
                    variant="primary"
                    class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                  >
                    Login
                  </Button>
                </div>
              </Form>
            </div>
          </div>
          <!-- END: Login Form -->
        </div>
      </div>
    </div>
  </div>
</template>
