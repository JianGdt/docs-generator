"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { CommitFormValues } from "@/app/lib/schema/github";

interface CommitFieldsProps {
  control: Control<CommitFormValues>;
}

export function CommitFields({ control }: CommitFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="path"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black dark:text-white">
              File Path
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="docs/README.md" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black dark:text-white">
              Commit Message
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="docs: Update documentation" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
