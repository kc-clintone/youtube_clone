import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UploadDialog } from "@/components/upload-dialog";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ThumbnailGenerateModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  prompt: z.string().min(10),
});

// This modal is used to generate a thumbnail for a video
// using a prompt. It uses the OpenAI API to generate the thumbnail.
export const ThumbnailGenerateModal = ({
  videoId,
  open,
  onOpenChange,
}: ThumbnailGenerateModalProps) => {
  const myForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  // generate thumbnail
  const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
    onSuccess: () => {
      toast.success("Generating thumbnail...", {
        description: "This may take a few minutes",
      });
      myForm.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Something went terribly wrong");
    },
  });

  // use the mutation to generate a thumbnail
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    generateThumbnail.mutate({ id: videoId, prompt: values.prompt });
  };

  return (
    <UploadDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Upload thumbnail"
    >
      <Form {...myForm}>
        <form
          onSubmit={myForm.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={myForm.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Generate a thumbnail for my video"
                    {...field}
                    className="resize-none"
                    rows={5}
                    cols={30}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <button type="submit">Generate</button>
          </div>
        </form>
      </Form>
    </UploadDialog>
  );
};
