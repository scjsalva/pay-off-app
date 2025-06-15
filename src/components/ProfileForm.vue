<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
      <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        {{ isEditing ? 'Edit Profile' : 'Add New Profile' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Enter name..."
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Salary Amount (₱)
          </label>
          <input
            v-model="form.amount"
            type="number"
            required
            min="0"
            step="0.01"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Enter amount..."
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Salary Type
          </label>
          <select
            v-model="form.type"
            required
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Purchase Allowance (Optional)
          </label>
          <div class="flex items-center space-x-2">
            <input
              v-model="form.overrideAmount"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Enter amount for purchases..."
            />
            <select
              v-model="form.overrideType"
              class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div class="mt-2 flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="form.useAllowanceByDefault"
              class="form-checkbox h-4 w-4 text-amber-500"
            />
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Use Purchase Allowance by default for calculations
            </span>
          </div>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            This amount will be used for purchase calculations instead of your salary, regardless of tax settings.
          </p>
        </div>

        <div class="space-y-3">
          <button
            v-if="isEditing"
            type="button"
            @click="handleDelete"
            class="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Delete Profile
          </button>
          <div class="flex space-x-3">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
            >
              {{ isEditing ? 'Save Changes' : 'Add Profile' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps({
  profile: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

const store = useStore()
const isEditing = computed(() => !!props.profile)

const form = ref({
  name: '',
  amount: '',
  type: 'monthly',
  overrideAmount: '',
  overrideType: 'monthly',
  useAllowanceByDefault: false
})

onMounted(() => {
  if (props.profile) {
    form.value = { 
      ...props.profile,
      overrideAmount: props.profile.overrideAmount || '',
      overrideType: props.profile.overrideType || 'monthly',
      useAllowanceByDefault: props.profile.useAllowanceByDefault || false
    }
  }
})

const handleSubmit = () => {
  const profileData = {
    id: props.profile?.id || uuidv4(),
    name: form.value.name,
    amount: Number(form.value.amount),
    type: form.value.type,
    overrideAmount: form.value.overrideAmount ? Number(form.value.overrideAmount) : null,
    overrideType: form.value.overrideAmount ? form.value.overrideType : null,
    useAllowanceByDefault: form.value.useAllowanceByDefault
  }

  if (isEditing.value) {
    const newProfiles = store.state.profiles.map(p =>
      p.id === profileData.id ? profileData : p
    )
    store.commit('setProfiles', newProfiles)
  } else {
    store.commit('setProfiles', [...store.state.profiles, profileData])
    store.commit('setActiveProfile', profileData.id)
  }

  emit('close')
}

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this profile?')) {
    store.commit('setProfiles', store.state.profiles.filter(p => p.id !== props.profile.id))
    if (store.state.activeProfileId === props.profile.id) {
      store.commit('setActiveProfile', null)
    }
    emit('close')
  }
}
</script> 
