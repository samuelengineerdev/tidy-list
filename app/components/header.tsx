import { Button, ButtonIcon, ButtonText } from "@/components/ui/button"
import { HStack } from "@/components/ui/hstack"
import { View } from "@/components/ui/view"
import { ArrowRightIcon, MoonIcon, SunIcon } from "@/components/ui/icon"
import Logo from "@/components/logo"
import { useCreateOrUpdateMutation } from "@/api/user-settings-api"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { logOut } from "@/store/slices/authSlice"
import { setTheme } from "@/store/slices/user-setting-slice"

export default function Header() {
  const dispatch = useAppDispatch()
  const isDark = useAppSelector((state) => state.userSettings.darkMode)
  const isAuthenticated = useAppSelector((state) => Boolean(state.auth.token))
  const [updateUserSettings] = useCreateOrUpdateMutation()

  const handleLogout = () => {
    dispatch(logOut())
  }

  const toggleTheme = async () => {
    const nextDarkMode = !isDark
    dispatch(setTheme({ darkMode: nextDarkMode }))

    if (!isAuthenticated) return

    try {
      await updateUserSettings({ darkMode: nextDarkMode }).unwrap()
    } catch (error) {
      // Revert local state if persisting preference fails.
      dispatch(setTheme({ darkMode: isDark }))
      console.log("Error saving theme preference", error)
    }
  }

  return (
    <View className="w-full border-b border-border bg-card/95">
      <View className="mx-auto px-4 sm:px-6 lg:px-8 pt-7">
        <HStack className="h-16 items-center justify-between min-w-full">
          <Logo />

          <HStack className="items-center gap-2">
            <Button onPress={toggleTheme} className="transition-all transition-smooth bg-accent rounded-lg">
              <ButtonIcon as={isDark ? SunIcon : MoonIcon} className="h-5 w-5 text-card-foreground" />
            </Button>

            <Button onPress={handleLogout} className="transition-all bg-destructive/10">
              <ButtonText className="text-destructive">Log out</ButtonText>
              <ButtonIcon as={ArrowRightIcon} className="h-5 w-5 text-destructive" />
            </Button>
          </HStack>
        </HStack>
      </View>
    </View>
  )
}
