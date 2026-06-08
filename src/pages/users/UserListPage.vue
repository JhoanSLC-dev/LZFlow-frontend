<template>
    <div>
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="heading">Users</h1>
                <p class="subheading mt-1">Manage your team members</p>
            </div>
            <button @click="openCreate" class="btn-primary">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Invite User
            </button>
        </div>

        <DataTable :columns="columns" :data="users as unknown as Record<string, unknown>[]">
            <template #cell-name="{ row }">
                <div class="flex items-center gap-3">
                    <div
                        class="w-8 h-8 rounded-full bg-gradient-to-br from-lz-500/20 to-lz-700/20 flex items-center justify-center border border-dark-600">
                        <span class="text-xs font-medium text-lz-400">{{ (row.name as string)?.charAt(0) }}</span>
                    </div>
                    <span class="text-dark-200">{{ row.name }}</span>
                </div>
            </template>
            <template #cell-isActive="{ row }">
                <span :class="row.isActive ? 'badge-success' : 'badge-danger'">
                    {{ row.isActive ? 'Active' : 'Inactive' }}
                </span>
            </template>
            <template #cell-role="{ row }">
                <span class="badge-info">{{ row.role }}</span>
            </template>
            <template #actions="{ row }">
                <button @click="openEdit(row)"
                    class="text-lz-400 hover:text-lz-300 text-sm mr-3 font-medium">Edit</button>
                <button @click="confirmDelete(row.id as string)"
                    class="text-red-400 hover:text-red-300 text-sm font-medium">Delete</button>
            </template>
        </DataTable>

        <Modal v-model="showModal" :title="editing ? 'Edit User' : 'Invite User'">
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <FormField name="name" label="Name" v-model="form.name" :error="errors.name" />
                <FormField name="email" label="Email" type="email" v-model="form.email" :error="errors.email"
                    :disabled="!!editing" />
                <FormField v-if="!editing" name="password" label="Password" type="password" v-model="form.password"
                    :error="errors.password" />
                <FormField name="role" label="Role" type="select" v-model="form.role" :options="roleOptions" />
                <div class="flex justify-end gap-3">
                    <button type="button" @click="showModal = false" class="btn-secondary">Cancel</button>
                    <button type="submit" :disabled="saving" class="btn-primary">{{ saving ? 'Saving...' : 'Save'
                        }}</button>
                </div>
            </form>
            <p v-if="apiError" class="text-sm text-red-400 mt-3 text-center">{{ apiError }}</p>
        </Modal>
    </div>
</template>

<script setup lang="ts">

import { ref, reactive, onMounted } from 'vue';
import { userService } from '../../services/user.service';
import DataTable from '../../components/ui/DataTable.vue';
import Modal from '../../components/ui/Modal.vue';
import FormField from '../../components/ui/FormField.vue';
import type { User } from '../../types';

const users = ref<User[]>([]);
const showModal = ref(false);
const editing = ref<User | null>(null);
const saving = ref(false);
const apiError = ref('');
const form = reactive({ name: '', email: '', password: '', role: 'employee' });
const errors = reactive({ name: '', email: '', password: '', role: '' });
const columns = [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' }, { key: 'isActive', label: 'Status' }];
const roleOptions = [{ value: 'owner', label: 'Owner' }, { value: 'manager', label: 'Manager' }, { value: 'employee', label: 'Employee' }];

function openCreate() { editing.value = null; form.name = ''; form.email = ''; form.password = ''; form.role = 'employee'; showModal.value = true; }
function openEdit(user: unknown) {
    const u = user as User; editing.value = u;
    form.name = u.name; form.email = u.email; form.password = ''; form.role = u.role; showModal.value = true;
}
async function handleSubmit() {
    apiError.value = ''; Object.keys(errors).forEach((k) => (errors[k as keyof typeof errors] = ''));
    let hasError = false;
    if (!form.name) { errors.name = 'Required'; hasError = true; }
    if (!form.email) { errors.email = 'Required'; hasError = true; }
    if (!editing.value && (!form.password || form.password.length < 8)) { errors.password = 'Min 8 characters'; hasError = true; }
    if (hasError) return;
    saving.value = true;
    try {
        if (editing.value) {
            await userService.update(editing.value.id, { name: form.name, role: form.role as 'owner' | 'manager' | 'employee' });
        } else {
            await userService.create({ name: form.name, email: form.email, password: form.password, role: form.role as 'owner' | 'manager' | 'employee' });
        }
        users.value = await userService.findAll();
        showModal.value = false;
    } catch (err: unknown) { const error = err as { response?: { data?: { error?: string } } }; apiError.value = error?.response?.data?.error || 'Save failed'; }
    finally { saving.value = false; }
}
function confirmDelete(id: string) { if (confirm('Delete this user?')) { userService.remove(id).then(() => { users.value = users.value.filter((u) => u.id !== id); }); } }
onMounted(async () => { users.value = await userService.findAll(); });
</script>
