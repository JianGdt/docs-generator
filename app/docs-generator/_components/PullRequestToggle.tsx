"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { CommitFormValues } from "@/app/lib/schema/github";
import { Checkbox } from "@//components/ui/checkbox";

interface PullRequestToggleProps {
  control: Control<CommitFormValues>;
}

export function PullRequestToggle({ control }: PullRequestToggleProps) {
  return (
    <FormField
      control={control}
      name="createPR"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className="w-4 h-4"
            />
          </FormControl>
          <FormLabel className="mt-0! text-black dark:text-white font-normal">
            Create Pull Request instead of direct commit
          </FormLabel>
        </FormItem>
      )}
    />
  );
}
