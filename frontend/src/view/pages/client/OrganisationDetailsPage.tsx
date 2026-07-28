import { useContext, useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Country, State, City } from "country-state-city";
import {
  Building2,
  Sparkles,
  Pencil,
  Save,
  X,
  Loader2,
  Globe,
  Mail,
  MapPin,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormInput from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import FormTextarea from "@/components/custom/FormTextarea";
import { toast } from "sonner";
import ClientLayout from "@/view/layout/ClientLayout";
import Context from "@/context/context";
import { updateOrganisationDetailsApi } from "@/api/organisation.api";

// Validation schema for updating organisation details
const schema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  website: z.string(), // Always disabled in UI
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    zipCode: z.string().min(2, "Zip code is required"),
  }),
  contact: z.string().min(3, "Contact number is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
});

type FormData = z.infer<typeof schema>;

export default function OrganisationDetailsPage() {
  const {
    organisationState: {
      organisationDetails,
      getOrganisationDetailsAction,
      updateOrganisationStateAction,
    },
  } = useContext(Context);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // States for country-state-city dropdowns
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [countries, setCountries] = useState<
    { label: string; value: string }[]
  >([]);
  const [states, setStates] = useState<{ label: string; value: string }[]>([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Load countries list
  useEffect(() => {
    const formattedCountries = Country.getAllCountries().map((c) => ({
      label: c.name,
      value: c.isoCode,
    }));
    setCountries(formattedCountries);
  }, []);

  // Helper to populate form data from organisationDetails
  const populateFormData = useCallback(() => {
    if (!organisationDetails) return;

    // Find country code
    const rawCountry = organisationDetails.address?.country || "";
    const matchingCountry = Country.getAllCountries().find(
      (c) => c.name === rawCountry || c.isoCode === rawCountry,
    );
    const countryCode = matchingCountry ? matchingCountry.isoCode : "";
    setSelectedCountry(countryCode);

    // Populate states for country
    if (countryCode) {
      const formattedStates = State.getStatesOfCountry(countryCode).map((s) => ({
        label: s.name,
        value: s.isoCode,
      }));
      setStates(formattedStates);

      // Find state code
      const rawState = organisationDetails.address?.state || "";
      const matchingState = State.getStatesOfCountry(countryCode).find(
        (s) => s.name === rawState || s.isoCode === rawState,
      );
      const stateCode = matchingState ? matchingState.isoCode : "";
      setSelectedState(stateCode);

      // Populate cities for state
      if (stateCode) {
        const formattedCities = City.getCitiesOfState(countryCode, stateCode).map(
          (c) => ({
            label: c.name,
            value: c.name,
          }),
        );
        setCities(formattedCities);
        setSelectedCity(organisationDetails.address?.city || "");
      } else {
        setCities([]);
        setSelectedCity("");
      }
    } else {
      setStates([]);
      setCities([]);
      setSelectedState("");
      setSelectedCity("");
    }

    reset({
      name: organisationDetails.name || "",
      email: organisationDetails.email || "",
      website: organisationDetails.website || "",
      contact: organisationDetails.contact || "",
      description: organisationDetails.description || "",
      address: {
        street: organisationDetails.address?.street || "",
        country: countryCode,
        state: organisationDetails.address?.state || "",
        city: organisationDetails.address?.city || "",
        zipCode: organisationDetails.address?.zipCode || "",
      },
    });
  }, [organisationDetails, reset]);

  // Initial fetch and populate
  useEffect(() => {
    if (!organisationDetails) {
      getOrganisationDetailsAction();
    } else {
      populateFormData();
    }
  }, [getOrganisationDetailsAction, organisationDetails, populateFormData]);

  // Update states when selected country changes during edit
  const handleCountryChange = (val: string) => {
    setSelectedCountry(val);
    setValue("address.country", val, { shouldValidate: true });

    const formattedStates = State.getStatesOfCountry(val).map((s) => ({
      label: s.name,
      value: s.isoCode,
    }));
    setStates(formattedStates);
    setCities([]);
    setSelectedState("");
    setSelectedCity("");
    setValue("address.state", "", { shouldValidate: true });
    setValue("address.city", "", { shouldValidate: true });
  };

  // Update cities when selected state changes during edit
  const handleStateChange = (val: string) => {
    setSelectedState(val);

    const stateName =
      State.getStateByCodeAndCountry(val, selectedCountry)?.name || val;
    setValue("address.state", stateName, { shouldValidate: true });

    if (selectedCountry && val) {
      const formattedCities = City.getCitiesOfState(
        selectedCountry,
        val,
      ).map((c) => ({
        label: c.name,
        value: c.name,
      }));
      setCities(formattedCities);
      setSelectedCity("");
      setValue("address.city", "", { shouldValidate: true });
    }
  };

  const handleCityChange = (val: string) => {
    setSelectedCity(val);
    setValue("address.city", val, { shouldValidate: true });
  };

  const handleCancel = () => {
    setIsEditing(false);
    populateFormData();
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const countryName =
        Country.getCountryByCode(data.address.country)?.name ||
        data.address.country;
      const stateName =
        State.getStateByCodeAndCountry(data.address.state, data.address.country)
          ?.name || data.address.state;

      const payload = {
        name: data.name,
        email: data.email,
        contact: data.contact,
        description: data.description,
        address: {
          street: data.address.street,
          country: countryName,
          state: stateName,
          city: data.address.city,
          zipCode: data.address.zipCode,
        },
      };

      const response = await updateOrganisationDetailsApi(payload);

      if (response[0]) {
        toast.success("Organisation details updated successfully!");
        updateOrganisationStateAction({
          organisationDetails: response[1]?.data,
        });
        setIsEditing(false);
      } else {
        toast.error(
          response[1]?.message || "Failed to update organisation details",
        );
      }
    } catch (error) {
      toast.error("An error occurred while saving details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClientLayout>
      <div className="relative min-h-screen bg-background pb-16">
        {/* Animated gradient background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-blob absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute top-20 -right-40 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="animate-blob animation-delay-4000 absolute -bottom-40 left-1/2 h-[500px] w-[500px] rounded-full bg-emerald-500/8 blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6">
          {/* Header Section */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Organisation Details
                </h1>
                <p className="text-sm text-muted-foreground">
                  View and manage your company profile and information
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md shadow-purple-500/20 hover:from-purple-500 hover:to-blue-500 transition-all duration-200"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Details
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    form="org-details-form"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md shadow-purple-500/20 hover:from-purple-500 hover:to-blue-500 transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Details Card */}
          <Card className="border border-white/10 bg-card/60 shadow-xl backdrop-blur-xl dark:bg-card/40">
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Company Profile</CardTitle>
                  <CardDescription>
                    {isEditing
                      ? "Edit your organisation details below. Note: Website URL cannot be changed."
                      : "Current organisation details stored in your workspace."}
                  </CardDescription>
                </div>
                {isEditing && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400 border border-purple-500/20">
                    <Sparkles className="h-3.5 w-3.5" /> Editing Mode
                  </span>
                )}
              </div>
            </CardHeader>

            <form id="org-details-form" onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-6 pt-6">
                {/* Section 1: Basic Information */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                    <Mail className="h-4 w-4 text-purple-400" />
                    Basic & Contact Information
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormInput
                      label="Company Name"
                      name="name"
                      register={register}
                      error={errors.name}
                      required={isEditing}
                      disabled={!isEditing}
                      placeholder="Acme Corp"
                    />

                    <FormInput
                      label="Company Email"
                      name="email"
                      type="email"
                      register={register}
                      error={errors.email}
                      required={isEditing}
                      disabled={!isEditing}
                      placeholder="contact@acme.com"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 mt-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Website URL
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60 z-10" />
                        <input
                          {...register("website")}
                          disabled={true}
                          placeholder="https://example.com"
                          className="w-full pl-10 pr-4 py-2.5 border border-input/50 rounded-lg bg-muted/40 text-muted-foreground text-sm cursor-not-allowed opacity-80 focus:outline-none"
                        />
                      </div>
                    </div>

                    <FormInput
                      label="Contact Phone"
                      name="contact"
                      register={register}
                      error={errors.contact}
                      required={isEditing}
                      disabled={!isEditing}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                {/* Section 2: Address Information */}
                <div className="pt-4 border-t border-white/5">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4 text-purple-400" />
                    Office Address
                  </h3>

                  <div className="space-y-4">
                    <FormInput
                      label="Street Address"
                      name="address.street"
                      register={register}
                      error={errors.address?.street}
                      required={isEditing}
                      disabled={!isEditing}
                      placeholder="123 Main St, Suite 400"
                    />

                    <div className="grid gap-4 sm:grid-cols-3">
                      <FormSelect
                        label="Country"
                        name="address.country"
                        options={countries}
                        error={errors.address?.country}
                        required={isEditing}
                        disabled={!isEditing}
                        value={selectedCountry}
                        onValueChange={handleCountryChange}
                      />

                      <FormSelect
                        label="State / Region"
                        name="address.state"
                        options={states}
                        error={errors.address?.state}
                        required={isEditing}
                        disabled={!isEditing || !selectedCountry}
                        value={selectedState}
                        onValueChange={handleStateChange}
                      />

                      <FormSelect
                        label="City"
                        name="address.city"
                        options={cities}
                        error={errors.address?.city}
                        required={isEditing}
                        disabled={!isEditing || !selectedState}
                        value={selectedCity}
                        onValueChange={handleCityChange}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <FormInput
                        label="Zip / Postal Code"
                        name="address.zipCode"
                        register={register}
                        error={errors.address?.zipCode}
                        required={isEditing}
                        disabled={!isEditing}
                        placeholder="94016"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Description */}
                <div className="pt-4 border-t border-white/5">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                    <FileText className="h-4 w-4 text-purple-400" />
                    Company Description
                  </h3>

                  <FormTextarea
                    label="Description"
                    name="description"
                    register={register}
                    error={errors.description}
                    required={isEditing}
                    disabled={!isEditing}
                    placeholder="Brief description of your company..."
                  />
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    </ClientLayout>
  );
}
