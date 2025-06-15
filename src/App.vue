<template>
  <div class="min-h-screen p-4 md:p-8 text-gray-900 dark:text-white">
    <!-- Header with Settings and Profile buttons -->
    <header class="flex justify-between items-center mb-8">
      <button
        @click="showSettings = true"
        class="p-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors aspect-square"
      >
        <i class="fas fa-cog text-lg"></i>
      </button>
      <div class="flex space-x-2">
        <button
          @click="showProfiles = true"
          class="p-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors aspect-square"
        >
          <i class="fas fa-user text-lg"></i>
        </button>
        <button
          @click="showSavedItems = true"
          class="p-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors aspect-square"
        >
          <i class="fas fa-bookmark text-lg"></i>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-2xl mx-auto">
      <div class="p-6 md:p-8">
        <!-- No Profile Warning -->
        <div v-if="!activeProfile" class="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
          <p class="text-yellow-800 dark:text-yellow-200">
            Please add a salary profile first to calculate your purchase worth.
          </p>
          <button
            @click="showProfiles = true"
            class="mt-2 text-green-500 hover:text-green-600 font-medium"
          >
            Add Profile →
          </button>
        </div>

        <!-- Price Input Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div class="relative mb-6">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span class="text-2xl text-green-500">₱</span>
            </div>
            <input
              v-model="price"
              type="number"
              class="w-full pl-12 pr-4 py-4 text-2xl font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter amount..."
            />
          </div>

          <!-- Calculate Button -->
          <div class="flex space-x-4">
            <button
              @click="calculate"
              :disabled="isCalculating || !price"
              class="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span v-if="isCalculating" class="flex items-center justify-center">
                <i class="fas fa-check-circle mr-2"></i>
                Calculated!
              </span>
              <span v-else class="flex items-center justify-center">
                <i class="fas fa-calculator mr-2"></i>
                Calculate Time to Pay Off
              </span>
            </button>
            <button
              v-if="showResults"
              @click="showSaveItemModal = true"
              class="px-6 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-200"
            >
              <i class="fas fa-bookmark mr-2"></i>
              Save
            </button>
          </div>
        </div>

        <!-- Results in Flip Clock Style -->
        <div v-if="showResults" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Hours -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center">
            <div class="font-mono text-4xl font-bold mb-2 text-gray-900 dark:text-white">
              <template v-if="revealedResults.hours">
                {{ formatNumber(results.hours) }}
              </template>
              <template v-else>
                --.--
              </template>
            </div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              HOURS
            </div>
          </div>

          <!-- Days -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center">
            <div class="font-mono text-4xl font-bold mb-2 text-gray-900 dark:text-white">
              <template v-if="revealedResults.days">
                {{ formatNumber(results.days) }}
              </template>
              <template v-else>
                --.--
              </template>
            </div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              DAYS
            </div>
          </div>

          <!-- Months -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center">
            <div class="font-mono text-4xl font-bold mb-2 text-gray-900 dark:text-white">
              <template v-if="revealedResults.months">
                {{ formatNumber(results.months) }}
              </template>
              <template v-else>
                --.--
              </template>
            </div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              MONTHS
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Settings Modal -->
    <div
      v-if="showSettings"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Settings
        </h2>

        <div class="space-y-4">
          <label class="flex items-center space-x-3">
            <input
              type="checkbox"
              v-model="settings.deductPHContributions"
              class="form-checkbox h-5 w-5 text-primary"
            />
            <span class="text-gray-700 dark:text-gray-300">
              Apply PH Taxes & Contributions
            </span>
          </label>

          <label class="flex items-center space-x-3">
            <input
              type="checkbox"
              v-model="isDarkMode"
              class="form-checkbox h-5 w-5 text-primary"
            />
            <span class="text-gray-700 dark:text-gray-300">
              Dark Mode
            </span>
          </label>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            @click="updateSettings"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Profiles Modal -->
    <div
      v-if="showProfiles"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full">
        <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Profiles
        </h2>

        <div class="space-y-4 max-h-96 overflow-y-auto">
          <div
            v-for="profile in profiles"
            :key="profile.id"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            :class="{ 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20': profile.id === selectedProfileId }"
            @click="selectProfile(profile.id)"
          >
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">
                {{ profile.name }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                {{ profile.type === 'monthly' ? 'Monthly' : 'Yearly' }}: ₱{{ maskSalary(profile) }}
              </p>
              <p v-if="profile.overrideAmount" class="text-sm text-green-500 mt-1">
                Purchase Allowance: ₱{{ maskSalary({ id: profile.id, amount: profile.overrideAmount }) }} {{ profile.overrideType }}
                <span v-if="profile.useAllowanceByDefault" class="text-xs text-gray-500 dark:text-gray-400">
                  (Default)
                </span>
              </p>
            </div>

            <div class="flex space-x-2">
              <button
                @click.stop="toggleSalaryVisibility(profile)"
                class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                :title="visibleSalaries.has(profile.id) ? 'Hide Salary' : 'Show Salary'"
              >
                <i class="fas" :class="visibleSalaries.has(profile.id) ? 'fa-eye-slash' : 'fa-eye'"></i>
              </button>
              <button
                @click.stop="editProfile(profile)"
                class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                title="Edit Profile"
              >
                <i class="fas fa-edit"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-between">
          <button
            @click="showAddProfile = true"
            class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            Add New Profile
          </button>
          <button
            @click="showProfiles = false"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Add ProfileForm component -->
    <ProfileForm
      v-if="showAddProfile"
      @close="showAddProfile = false"
    />

    <ProfileForm
      v-if="editingProfile"
      :profile="editingProfile"
      @close="editingProfile = null"
    />

    <!-- Saved Items Modal -->
    <div
      v-if="showSavedItems"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full">
        <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Saved Items
        </h2>

        <div class="space-y-4 max-h-96 overflow-y-auto">
          <div
            v-for="item in savedItems"
            :key="item.id"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            @click="loadSavedItem(item)"
          >
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">
                {{ item.name }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                ₱{{ new Intl.NumberFormat('en-US').format(item.amount) }}
              </p>
            </div>

            <button
              @click.stop="removeSavedItem(item.id)"
              class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-red-500"
              title="Remove Item"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            @click="showSavedItems = false"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Save Item Modal -->
    <div
      v-if="showSaveItemModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Save Item
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Item Name
            </label>
            <input
              v-model="newItemName"
              type="text"
              class="w-full px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter item name..."
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-4">
          <button
            @click="showSaveItemModal = false"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveItemFromModal"
            :disabled="!newItemName"
            class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import ProfileForm from './components/ProfileForm.vue'
import confetti from 'canvas-confetti'

const store = useStore()
const price = ref('')
const showResults = ref(false)
const revealedResults = ref({
  hours: false,
  days: false,
  months: false
})
const isCalculating = ref(false)
const showSettings = ref(false)
const showProfiles = ref(false)
const showAddProfile = ref(false)
const editingProfile = ref(null)
const visibleSalaries = ref(new Set())
const itemName = ref('')

// Computed properties
const settings = computed(() => store.state.settings)
const profiles = computed(() => store.state.profiles)
const activeProfile = computed(() => store.getters.activeProfile)
const selectedProfileId = computed(() => store.state.activeProfileId)

const isDarkMode = computed({
  get: () => settings.value.theme === 'dark',
  set: (value) => {
    store.commit('setSettings', {
      ...settings.value,
      theme: value ? 'dark' : 'light'
    })
  }
})

// Watch for theme changes
watch(isDarkMode, (newValue) => {
  document.documentElement.classList.toggle('dark', newValue)
})

// Initialize theme
document.documentElement.classList.toggle('dark', isDarkMode.value)

const results = ref({
  hours: 0,
  days: 0,
  months: 0
})

const triggerConfetti = (origin) => {
  const duration = 2 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 30 * (timeLeft / duration)
    confetti({
      ...defaults,
      particleCount,
      origin: { x: origin, y: Math.random() - 0.2 }
    })
  }, 250)
}

const calculate = () => {
  if (!activeProfile.value || !price.value) return

  isCalculating.value = true
  showResults.value = true
  revealedResults.value = {
    hours: false,
    days: false,
    months: false
  }

  const monthlyNet = calculateMonthlyNet(activeProfile.value)
  const hourlyRate = monthlyNet / 22 / 8
  const priceInHours = price.value / hourlyRate
  const priceInDays = priceInHours / 8
  const priceInMonths = priceInDays / 22

  results.value = {
    hours: priceInHours,
    days: priceInDays,
    months: priceInMonths
  }

  // Sequential reveal with delays
  setTimeout(() => {
    revealedResults.value.hours = true
    triggerConfetti(0.2)
  }, 500)

  setTimeout(() => {
    revealedResults.value.days = true
    triggerConfetti(0.5)
  }, 1500)

  setTimeout(() => {
    revealedResults.value.months = true
    triggerConfetti(0.8)
  }, 2500)
}

const calculateMonthlyNet = (profile) => {
  // If override amount is set and either useAllowanceByDefault is true or no salary is set
  if (profile.overrideAmount && (profile.useAllowanceByDefault || !profile.amount)) {
    return profile.overrideType === 'monthly'
      ? profile.overrideAmount
      : profile.overrideAmount / 12
  }

  // Otherwise, calculate from salary with deductions
  let annualGross = profile.type === 'monthly' ? profile.amount * 12 : profile.amount

  if (settings.value.deductPHContributions) {
    // Calculate deductions
    const sss = annualGross * 0.045
    const philhealth = annualGross * 0.045
    const pagibig = annualGross * 0.02

    // Calculate tax (simplified 2023 PH tax brackets)
    let tax = 0
    if (annualGross <= 250000) {
      tax = 0
    } else if (annualGross <= 400000) {
      tax = (annualGross - 250000) * 0.2
    } else if (annualGross <= 800000) {
      tax = 30000 + (annualGross - 400000) * 0.25
    } else if (annualGross <= 2000000) {
      tax = 130000 + (annualGross - 800000) * 0.3
    } else if (annualGross <= 8000000) {
      tax = 490000 + (annualGross - 2000000) * 0.32
    } else {
      tax = 2410000 + (annualGross - 8000000) * 0.35
    }

    annualGross -= (sss + philhealth + pagibig + tax)
  }

  return annualGross / 12
}

const formatNumber = (num) => {
  // Round to 2 decimal places
  const rounded = Math.round(num * 100) / 100
  // Format with leading zeros and 2 decimal places
  return rounded.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const toggleSalaryVisibility = (profile) => {
  if (visibleSalaries.value.has(profile.id)) {
    visibleSalaries.value.delete(profile.id)
  } else {
    visibleSalaries.value.add(profile.id)
  }
}

const editProfile = (profile) => {
  editingProfile.value = profile
}

const selectProfile = (profileId) => {
  // Only set as active profile if it's different from the current one
  if (profileId !== selectedProfileId.value) {
    store.commit('setActiveProfile', profileId)
    // If there's a price entered, recalculate
    if (price.value) {
      calculate()
    }
  }
  showProfiles.value = false
}

const maskSalary = (profile) => {
  return visibleSalaries.value.has(profile.id)
    ? new Intl.NumberFormat('en-US').format(profile.amount)
    : '*****'
}

// Add a watch for price changes to enable the calculate button
watch(price, () => {
  isCalculating.value = false
})

// Update the settings modal to close after changes
const updateSettings = () => {
  showSettings.value = false
  // If there's a price entered, recalculate
  if (price.value) {
    calculate()
  }
}

// Saved Items State
const showSavedItems = ref(false)
const showSaveItemModal = ref(false)
const newItemName = ref('')
const savedItems = ref([])

// Load saved items from localStorage on mount
onMounted(() => {
  const saved = localStorage.getItem('savedItems')
  if (saved) {
    savedItems.value = JSON.parse(saved)
  }
})

// Save items to localStorage whenever they change
watch(savedItems, (newItems) => {
  localStorage.setItem('savedItems', JSON.stringify(newItems))
}, { deep: true })

const saveItem = () => {
  if (!price.value) return

  // Trim the name and check if it's empty
  const trimmedName = itemName.value.trim()
  if (!trimmedName) {
    showSaveItemModal.value = true
    return
  }

  const newItem = {
    id: uuidv4(),
    name: trimmedName,
    amount: Number(price.value)
  }

  savedItems.value.push(newItem)
  itemName.value = ''
  showSaveItemModal.value = false
}

// Watch for modal opening to pre-fill the name
watch(showSaveItemModal, (newValue) => {
  if (newValue) {
    newItemName.value = itemName.value
  }
})

// Update the save function in the modal
const saveItemFromModal = () => {
  if (!price.value) return

  // Trim the name and check if it's empty
  const trimmedName = newItemName.value.trim()
  if (!trimmedName) return

  const newItem = {
    id: uuidv4(),
    name: trimmedName,
    amount: Number(price.value)
  }

  savedItems.value.push(newItem)
  itemName.value = '' // Clear the main input name
  newItemName.value = ''
  showSaveItemModal.value = false
}

const removeSavedItem = (id) => {
  savedItems.value = savedItems.value.filter(item => item.id !== id)
}

const loadSavedItem = (item) => {
  price.value = item.amount.toString()
  showSavedItems.value = false
}

// Add a watch for profiles changes to handle active profile
watch(profiles, (newProfiles) => {
  // If active profile is deleted, set the first available profile as active
  if (newProfiles.length > 0 && !newProfiles.find(p => p.id === selectedProfileId.value)) {
    store.commit('setActiveProfile', newProfiles[0].id)
  }
  // If no profiles left, clear active profile
  else if (newProfiles.length === 0) {
    store.commit('setActiveProfile', null)
  }
}, { deep: true })
</script>

<style>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
</style>
