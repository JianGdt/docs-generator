"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { CommitFormValues } from "@/app/lib/schema/github";

interface PullRequestFieldsProps {
  control: Control<CommitFormValues>;
}

export function PullRequestFields({ control }: PullRequestFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="prTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black dark:text-white">
              PR Title
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Update documentation" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="prBody"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black dark:text-white">
              PR Description
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Describe the changes..."
                className="text-black dark:text-white border-slate-700"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
