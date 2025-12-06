// Storage utility functions for Physio Vision

export const STORAGE_KEYS = {
  USERS: 'physiovision_users',
  CURRENT_USER: 'physiovision_current_user',
  APPOINTMENTS: 'physiovision_appointments',
  EXERCISES: 'physiovision_exercises',
  PATIENT_PLAN: 'physiovision_patient_plan',
};

/**
 * Clear all Physio Vision data from localStorage
 * Useful for testing or resetting the application
 */
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  console.log('All Physio Vision data cleared from localStorage');
  window.location.href = '/';
};

/**
 * Export all data as JSON for backup
 */
export const exportData = () => {
  const data: { [key: string]: any } = {};
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        data[name] = JSON.parse(value);
      } catch {
        data[name] = value;
      }
    }
  });
  return data;
};

/**
 * Get storage usage information
 */
export const getStorageInfo = () => {
  let totalSize = 0;
  const info: { [key: string]: number } = {};
  
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    const value = localStorage.getItem(key);
    if (value) {
      const size = new Blob([value]).size;
      info[name] = size;
      totalSize += size;
    }
  });
  
  return {
    items: info,
    totalSize,
    totalSizeKB: (totalSize / 1024).toFixed(2),
  };
};

// Expose utilities to window for debugging (development only)
if (import.meta.env.DEV) {
  (window as any).PhysioVision = {
    clearAllData,
    exportData,
    getStorageInfo,
  };
  console.log('🔧 PhysioVision debug utilities available:');
  console.log('  - PhysioVision.clearAllData() - Clear all data');
  console.log('  - PhysioVision.exportData() - Export data as JSON');
  console.log('  - PhysioVision.getStorageInfo() - View storage usage');
}

