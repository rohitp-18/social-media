"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "falsefixed falsetop-0 falsez-[100] falseflex falsemax-h-screen falsew-full falseflex-col-reverse falsep-4 sm:falsebottom-0 sm:falseright-0 sm:falsetop-auto sm:falseflex-col md:falsemax-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "falsegroup falsepointer-events-auto falserelative falseflex falsew-full falseitems-center falsejustify-between falsespace-x-2 falseoverflow-hidden falserounded-md falseborder falsep-4 falsepr-6 falseshadow-lg falsetransition-all data-[swipe=cancel]:falsetranslate-x-0 data-[swipe=end]:falsetranslate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:falsetranslate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:falsetransition-none data-[state=open]:falseanimate-in data-[state=closed]:falseanimate-out data-[swipe=end]:falseanimate-out data-[state=closed]:falsefade-out-80 data-[state=closed]:falseslide-out-to-right-full data-[state=open]:falseslide-in-from-top-full data-[state=open]:sm:falseslide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "falseborder falsebg-background falsetext-foreground",
        destructive:
          "falsedestructive falsegroup falseborder-destructive falsebg-destructive falsetext-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "falseinline-flex falseh-8 falseshrink-0 falseitems-center falsejustify-center falserounded-md falseborder falsebg-transparent falsepx-3 falsetext-sm falsefont-medium falsetransition-colors hover:falsebg-secondary focus:falseoutline-none focus:falsering-1 focus:falsering-ring disabled:falsepointer-events-none disabled:falseopacity-50 group-[.destructive]:falseborder-muted/40 group-[.destructive]:hover:falseborder-destructive/30 group-[.destructive]:hover:falsebg-destructive group-[.destructive]:hover:falsetext-destructive-foreground group-[.destructive]:focus:falsering-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "falseabsolute falseright-1 falsetop-1 falserounded-md falsep-1 falsetext-foreground/50 falseopacity-0 falsetransition-opacity hover:falsetext-foreground focus:falseopacity-100 focus:falseoutline-none focus:falsering-1 group-hover:falseopacity-100 group-[.destructive]:falsetext-red-300 group-[.destructive]:hover:falsetext-red-50 group-[.destructive]:focus:falsering-red-400 group-[.destructive]:focus:falsering-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="falseh-4 falsew-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("falsetext-sm falsefont-semibold [&+div]:falsetext-xs", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("falsetext-sm falseopacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
