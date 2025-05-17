
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, Upload, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Define form schema
const formSchema = z.object({
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  businessType: z.string({
    required_error: "Please select a business type.",
  }),
  foundationDate: z.date({
    required_error: "Foundation date is required.",
  }),
  ceo: z.string().min(2, {
    message: "CEO name must be at least 2 characters.",
  }),
  coFounders: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  userRole: z.string({
    required_error: "Please select your role in the business.",
  }),
  description: z.string().optional(),
});

const BusinessRegistrationPage = () => {
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // Get previously selected business type from localStorage
  const savedBusinessType = localStorage.getItem("businessType") || "";

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessType: savedBusinessType,
      coFounders: "",
      website: "",
      description: "",
    },
  });

  // Handle document upload simulation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      
      // Simulate upload delay
      setTimeout(() => {
        const filesArray = Array.from(e.target.files || []);
        const newFiles = filesArray.map(file => file.name);
        
        setUploadedDocs([...uploadedDocs, ...newFiles]);
        setUploading(false);
        toast.success("Document uploaded successfully!");
      }, 1500);
    }
  };

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Save business data to localStorage
    localStorage.setItem("businessData", JSON.stringify(values));
    
    // Show success message
    toast.success("Business registered successfully!", {
      description: "You can now access all features of Business Vista Advisor.",
    });
    
    // Navigate to dashboard
    setTimeout(() => {
      navigate("/app");
    }, 1500);
  };

  return (
    <div className="py-6">
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Register Your Business</h1>
        <p className="text-gray-500 mb-6">
          Complete this form to register your business and unlock the full potential of 
          Business Vista Advisor.
        </p>

        <div className="max-w-3xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your business name" {...field} />
                          </FormControl>
                          <FormDescription>
                            The official registered name of your business.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select business type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Global Corporation">🌍 Global Corporation</SelectItem>
                              <SelectItem value="Regional Enterprise">🌐 Regional Enterprise</SelectItem>
                              <SelectItem value="National Business">🏙️ National Business</SelectItem>
                              <SelectItem value="Local/SME">🏡 Local/SME</SelectItem>
                              <SelectItem value="Digital/Online-Only Business">💻 Digital/Online-Only Business</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the type that best describes your business scale and operations.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="foundationDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Foundation Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1800-01-01")
                                }
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            The date your business was officially founded.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ceo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEO Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter CEO's full name" {...field} />
                          </FormControl>
                          <FormDescription>
                            The current Chief Executive Officer of your business.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coFounders"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Co-Founders (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter co-founder names, separated by commas"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            List the co-founders of your business, if applicable.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your business website URL.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="userRole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Role in the Business</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="CEO">CEO</SelectItem>
                              <SelectItem value="Co-Founder">Co-Founder</SelectItem>
                              <SelectItem value="Executive">Executive</SelectItem>
                              <SelectItem value="Manager">Manager</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Note: Currently only CEOs can create a business assistant.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your business, products, and services..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Brief description of your business operations and focus.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Label className="text-base">Business Documents (Optional)</Label>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload relevant business documents like business plans, financial statements, or incorporation documents.
                  </p>
                  
                  <div className="flex items-center justify-center w-full">
                    <Label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      {uploading ? (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="animate-spin h-8 w-8 text-business-teal mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <p className="text-sm text-gray-500">Uploading...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PDF, DOC, XLS (MAX. 10MB)</p>
                        </div>
                      )}
                      <input 
                        id="dropzone-file" 
                        type="file" 
                        className="hidden"
                        onChange={handleFileChange} 
                        disabled={uploading}
                        multiple 
                      />
                    </Label>
                  </div>
                  
                  {uploadedDocs.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Uploaded Documents</h4>
                      <ul className="space-y-2">
                        {uploadedDocs.map((doc, index) => (
                          <li 
                            key={index} 
                            className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm"
                          >
                            <span className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              {doc}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                setUploadedDocs(uploadedDocs.filter((_, i) => i !== index));
                                toast("Document removed");
                              }}
                            >
                              <X className="h-4 w-4 text-gray-500" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" size="lg">Register Business</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistrationPage;
