<template>
    <div class="min-h-screen bg-dark-900 flex">
        <Sidebar />
        <div class="flex-1 flex flex-col lg:ml-64">
            <Header />
            <main class="flex-1 p-4 sm:p-6 lg:p-8">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import Sidebar from '../components/ui/Sidebar.vue';
import Header from '../components/ui/Header.vue';
</script>
