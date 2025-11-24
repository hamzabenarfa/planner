"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useGetAvailableMembers } from "@/hooks/useMembers";
import { useAddProjectMember } from "@/hooks/useProjectMembers";
import { useParams } from "next/navigation";

const formSchema = z.object({
  memberId: z.string().optional(),
});
const SelectMember = () => {
  const param = useParams();

  const { membersData } = useGetAvailableMembers();
  const { addMember } = useAddProjectMember();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      memberId: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data.memberId) {
      addMember({
        memberId: parseInt(data.memberId),
        projectId: parseInt(param.id[0]),
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="memberId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Member</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue>
                      {(membersData &&
                        Array.isArray(membersData) &&
                        membersData.find(
                          (member) => member.id == Number(field.value)
                        )?.name) ||
                        "Select member"}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {membersData &&
                    Array.isArray(membersData) &&
                    membersData.map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.name} ({member.email})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default SelectMember;
