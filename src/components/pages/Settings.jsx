import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const Settings = () => {
  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: true,
    autoArchive: false,
    defaultPriority: 'medium',
    workingHours: {
      start: '09:00',
      end: '17:00'
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleWorkingHoursChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [key]: value
      }
    }));
  };

  const settingSections = [
    {
      title: 'Appearance',
      icon: 'Palette',
      settings: [
        {
          label: 'Theme',
          key: 'theme',
          type: 'select',
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System' }
          ]
        }
      ]
    },
    {
      title: 'Notifications',
      icon: 'Bell',
      settings: [
        {
          label: 'Enable Notifications',
          key: 'notifications',
          type: 'toggle',
          description: 'Get notified about due tasks and reminders'
        }
      ]
    },
    {
      title: 'Task Management',
      icon: 'Settings',
      settings: [
        {
          label: 'Auto-archive completed tasks',
          key: 'autoArchive',
          type: 'toggle',
          description: 'Automatically move completed tasks to archive after 7 days'
        },
        {
          label: 'Default Priority',
          key: 'defaultPriority',
          type: 'select',
          options: [
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' }
          ]
        }
      ]
    },
    {
      title: 'Working Hours',
      icon: 'Clock',
      settings: [
        {
          label: 'Start Time',
          key: 'start',
          type: 'time',
          parent: 'workingHours'
        },
        {
          label: 'End Time',
          key: 'end',
          type: 'time',
          parent: 'workingHours'
        }
      ]
    }
  ];

  const renderSetting = (setting) => {
    const value = setting.parent 
      ? preferences[setting.parent][setting.key]
      : preferences[setting.key];

    const onChange = (newValue) => {
      if (setting.parent) {
        handleWorkingHoursChange(setting.key, newValue);
      } else {
        handlePreferenceChange(setting.key, newValue);
      }
    };

    switch (setting.type) {
      case 'toggle':
        return (
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">{setting.label}</div>
              {setting.description && (
                <div className="text-sm text-gray-600">{setting.description}</div>
              )}
            </div>
            <button
              onClick={() => onChange(!value)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${value ? 'bg-primary' : 'bg-gray-200'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${value ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        );

      case 'select':
        return (
          <div>
            <label className="block font-medium text-gray-900 mb-2">
              {setting.label}
            </label>
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {setting.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'time':
        return (
          <div>
            <label className="block font-medium text-gray-900 mb-2">
              {setting.label}
            </label>
            <input
              type="time"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b bg-surface">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Customize your TaskFlow experience</p>
          </div>
          <ApperIcon name="Settings" size={32} className="text-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          {settingSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-surface rounded-lg border p-6"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <ApperIcon name={section.icon} size={20} className="text-primary" />
                <h2 className="text-lg font-heading font-semibold text-gray-900">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-6">
                {section.settings.map((setting, settingIndex) => (
                  <motion.div
                    key={setting.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (sectionIndex * 0.1) + (settingIndex * 0.05) }}
                  >
                    {renderSetting(setting)}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end"
          >
            <Button
              onClick={handleSave}
              loading={isLoading}
              icon="Save"
              size="lg"
            >
              Save Settings
            </Button>
          </motion.div>

          {/* App Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-surface rounded-lg border p-6 text-center"
          >
            <ApperIcon name="Info" size={24} className="text-primary mx-auto mb-3" />
            <h3 className="font-heading font-semibold text-gray-900 mb-2">TaskFlow</h3>
            <p className="text-sm text-gray-600">
              Version 1.0.0 • Built with React and Tailwind CSS
            </p>
            <p className="text-xs text-gray-500 mt-2">
              A productivity app designed for busy professionals
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;