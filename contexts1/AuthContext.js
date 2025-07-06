"use client"

import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // ✅ FIXED: Check for saved user data on app startup (instead of clearing it)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          console.log("👤 Restored user from localStorage:", userData)
          console.log("🖼️ Restored profileImage:", userData.profileImage ? "✅ Present" : "❌ Missing")
          setUser(userData)
        } else {
          console.log("❌ No stored user found in localStorage")
        }
      } catch (error) {
        console.error("❌ Error reading stored auth:", error)
        localStorage.removeItem("user")
      } finally {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  // ✅ Save or remove user in localStorage with better logging
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        console.log("💾 Saving user to localStorage:", user.email)
        console.log("🖼️ Saving profileImage:", user.profileImage ? "✅ Present" : "❌ Missing")
        localStorage.setItem("user", JSON.stringify(user))
      } else {
        console.log("🗑️ Removing user from localStorage")
        localStorage.removeItem("user")
      }
    }
  }, [user])

  // ✅ Optional: log user when updated (for debug)
  useEffect(() => {
    if (user) {
      console.log("👤 AuthContext user set:", user)
    }
  }, [user])

  // 🔥 GLOBAL TITLE PROTECTION - Override any title changes
  useEffect(() => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const setArtizenTitle = () => {
        if (document.title !== "Artizen") {
          document.title = "Artizen"
        }
      }

      // Set immediately
      setArtizenTitle()

      // Watch for any title changes and override them
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList" && mutation.target.nodeName === "TITLE") {
            setArtizenTitle()
          }
        })
      })

      // Observe title changes
      const titleElement = document.querySelector("title")
      if (titleElement) {
        observer.observe(titleElement, { childList: true, subtree: true })
      }

      // Also observe head changes
      observer.observe(document.head, { childList: true, subtree: true })

      // Set interval as backup
      const titleInterval = setInterval(setArtizenTitle, 100)

      // Listen for navigation events
      const handleNavigation = () => {
        setTimeout(setArtizenTitle, 0)
        setTimeout(setArtizenTitle, 10)
        setTimeout(setArtizenTitle, 50)
        setTimeout(setArtizenTitle, 100)
      }

      // Listen for various navigation events
      window.addEventListener("popstate", handleNavigation)
      window.addEventListener("pushstate", handleNavigation)
      window.addEventListener("replacestate", handleNavigation)
      window.addEventListener("hashchange", handleNavigation)
      window.addEventListener("focus", setArtizenTitle)

      // Cleanup
      return () => {
        observer.disconnect()
        clearInterval(titleInterval)
        window.removeEventListener("popstate", handleNavigation)
        window.removeEventListener("pushstate", handleNavigation)
        window.removeEventListener("replacestate", handleNavigation)
        window.removeEventListener("hashchange", handleNavigation)
        window.removeEventListener("focus", setArtizenTitle)
      }
    }
  }, [])

  return <AuthContext.Provider value={{ user, setUser, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
