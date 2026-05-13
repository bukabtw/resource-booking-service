<template>
  <BasePage>
    <template #header>{{ $t('app.about') }}</template>
    <BaseCard :title="$t('about.projectTitle')">
      <p>{{ $t('about.description') }}</p>
    </BaseCard>
    <BaseCard :title="$t('about.features')">
      <v-list>
        <v-list-item v-for="feature in features" :key="feature">
          <template v-slot:prepend><v-icon color="success">mdi-check-circle</v-icon></template>
          <v-list-item-title>{{ feature }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </BaseCard>
    <BaseCard :title="$t('about.technologies')">
      <v-row>
        <v-col cols="6" sm="3" v-for="tech in technologies" :key="tech.name">
          <v-card variant="outlined" class="text-center pa-4" hover>
            <v-icon size="32" :color="tech.color">{{ tech.icon }}</v-icon>
            <div class="text-subtitle-2 mt-2">{{ tech.name }}</div>
            <div class="text-caption text-grey">{{ tech.version }}</div>
          </v-card>
        </v-col>
      </v-row>
    </BaseCard>
    <BaseCard :title="$t('about.contact')">
      <p>{{ $t('about.contactText') }}</p>
      <v-btn color="primary" variant="outlined" href="https://github.com/bukabtw" target="_blank" prepend-icon="mdi-github">
        GitHub
      </v-btn>
    </BaseCard>
  </BasePage>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BasePage from '../components/BasePage.vue'
import BaseCard from '../components/BaseCard.vue'

const { t } = useI18n()

const features = computed(() => [
  t('about.feature1'),
  t('about.feature2'),
  t('about.feature3'),
  t('about.feature4')
])

const technologies = [
  { name: 'Vue 3', icon: 'mdi-vuejs', color: 'success', version: '3.5' },
  { name: 'Vite', icon: 'mdi-lightning-bolt', color: 'warning', version: '8.0' },
  { name: 'Vuetify', icon: 'mdi-vuetify', color: 'primary', version: '3.5' },
  { name: 'Vue Router', icon: 'mdi-routes', color: 'error', version: '4.0' },
  { name: 'Vuex', icon: 'mdi-store', color: 'info', version: '4.0' },
  { name: 'vue-i18n', icon: 'mdi-translate', color: 'purple', version: '9.0' }
]
</script>
