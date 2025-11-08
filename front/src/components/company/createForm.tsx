"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Checkbox } from "../ui/checkbox";
import back from "@/assets/back.png";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  clearError,
  createCompany,
  resetcompany,
  updateCompany,
} from "@/store/company/companySlice";

function CreateForm({
  nextStep,
  edit,
  id,
}: {
  nextStep: () => any;
  edit: boolean;
  id?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [headline, setHeadline] = useState("");
  const [about, setAbout] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [steps, setSteps] = useState(1);
  const [logo, setLogo] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [companyPreview, setCompanyPreview] = useState<boolean>(false);
  const [previousBanner, setPreviousBanner] = useState<string | null>(null);
  const [previousLogo, setPreviousLogo] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { company, loading, error, created, updated } = useSelector(
    (state: RootState) => state.company
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !headline) {
      toast.error("Please fill in all required fields.", {
        position: "top-center",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("website", website);
    formData.append("headline", headline);
    formData.append("about", about);
    formData.append("state", state);
    formData.append("city", city);
    formData.append("country", country);
    if (logo) formData.append("logo", logo);
    if (banner) formData.append("banner", banner);

    if (edit) {
      dispatch(updateCompany({ id, form: formData }));
    } else {
      if (!checked) {
        toast.error("You must agree to the terms and conditions.", {
          position: "top-center",
        });
        return;
      }
      dispatch(createCompany(formData));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviousLogo(null);
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviousBanner(null);
      setBanner(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function stepSubmit(number: number) {
    if (name && email && headline) {
      setSteps(number);
    } else {
      toast.error("Please fill in all required fields.", {
        position: "top-center",
      });
    }
  }

  useEffect(() => {
    if (company && edit) {
      setName(company.name);
      setEmail(company.email);
      setPhone(company.phone);
      setAddress(company.address ? company.address[0].address : "");
      setWebsite(company.website);
      setHeadline(company.headline);
      setAbout(company.about);
      setState(company.address ? company.address[0].state : "");
      setCity(company.address ? company.address[0].city : "");
      setCountry(company.address ? company.address[0].country : "");
      setPreviousBanner(company.banner?.url || null);
      setPreviousLogo(company.avatar?.url || null);
    }
  }, [company, edit]);

  useEffect(() => {
    if (created) {
      toast.success("Company created successfully!", {
        position: "top-center",
      });
      dispatch(resetcompany());
      nextStep();
    }
    if (updated) {
      toast.success("Company updated successfully!", {
        position: "top-center",
      });
      dispatch(resetcompany());
      nextStep();
    }
    if (error) {
      toast.error(error, {
        position: "top-center",
      });
      dispatch(clearError());
    }
  }, [created, updated, nextStep]);

  return (
    <section className="flex flex-col items-center gap-10">
      <div className="w-full flex justify-start items-center">
        <Button
          variant={"outline"}
          className="border-none flex gap-4 items-center"
        >
          <ArrowLeft className="w-6 h-6" />
          <div className="font-semibold text-base">Back</div>
        </Button>
      </div>
      <div className="w-full flex md:flex-row flex-col justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-5 w-full md:w-1/2"
        >
          <Card className="w-full max-w-md">
            <CardContent className="py-3">
              {/* Section 1: Basic Information */}
              {steps === 1 && (
                <div className="flex flex-col gap-3 mb-5">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="grid w-full mb-2 max-w-sm items-center gap-1">
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                      className="p-1"
                      id="name"
                      placeholder="Name..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid w-full mb-2 max-w-sm items-center gap-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      className="p-1"
                      id="email"
                      placeholder="Email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid w-full mb-2 max-w-sm items-center gap-1">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      className="p-1"
                      id="phone"
                      placeholder="Phone..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="grid w-full mb-2 max-w-sm items-center gap-1">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      className="p-1"
                      id="website"
                      placeholder="Website..."
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                  <div className="grid w-full mb-2 max-w-sm items-center gap-1">
                    <Label htmlFor="headline">Headline</Label>
                    <Input
                      className="p-1"
                      id="headline"
                      placeholder="Headline..."
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                    />
                  </div>
                  <div className="grid w-full mb-2 max-w-sm items-center gap-1">
                    <Label htmlFor="about">About</Label>
                    <Textarea
                      className="p-1"
                      id="about"
                      placeholder="About..."
                      value={about}
                      rows={3}
                      onChange={(e) => setAbout(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCompanyPreview(true)}
                    >
                      Preview
                    </Button>
                    <Button
                      disabled={!headline || !name || !email}
                      onClick={() => stepSubmit(2)}
                      type="button"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Logo and Banner Upload */}
              {steps === 2 && (
                <div className="flex flex-col gap-4 mb-5">
                  <h3 className="text-lg font-semibold">
                    Upload Logo and Banner
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <Label
                        htmlFor="logo"
                        className="font-semibold text-sm mb-1"
                      >
                        Company Logo
                      </Label>
                      <div className="flex items-center justify-between border-2 border-dashed border-gray-300 rounded-lg p-4">
                        {previousLogo || logoPreview ? (
                          <img
                            loading="lazy"
                            src={previousLogo || logoPreview || ""}
                            alt="Company logo preview"
                            className="w-24 h-24 rounded-lg"
                          />
                        ) : (
                          <span className="text-sm text-gray-500">
                            No file selected
                          </span>
                        )}
                        <div className="flex gap-1">
                          {(previousLogo || logoPreview) && (
                            <button
                              type="button"
                              className="bg-red-600 px-3 py-1 text-white rounded text-sm"
                              onClick={() => {
                                setPreviousLogo(null);
                                setLogoPreview(null);
                                setLogo(null);
                              }}
                            >
                              Remove
                            </button>
                          )}
                          <label
                            htmlFor="logo"
                            className="px-3 py-1 bg-primary/90 hover:bg-primary text-white rounded cursor-pointer text-sm"
                          >
                            Upload
                            <input
                              type="file"
                              id="logo"
                              onChange={handleLogoChange}
                              accept="image/*"
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Supported: JPG, PNG, GIF
                      </p>
                    </div>
                    <div>
                      <Label
                        htmlFor="banner"
                        className="font-semibold text-sm mb-1"
                      >
                        Company Banner
                      </Label>
                      <div className="flex items-center w-full justify-between border-2 border-dashed border-gray-300 rounded-lg p-4">
                        {previousBanner || bannerPreview ? (
                          <img
                            loading="lazy"
                            src={previousBanner || bannerPreview || ""}
                            alt="Company banner preview"
                            className="w-1/2 min-h-24 aspect-[4/1] rounded-lg"
                          />
                        ) : (
                          <span className="text-sm text-gray-500">
                            No file selected
                          </span>
                        )}
                        <div className="flex gap-2">
                          {(previousBanner || bannerPreview) && (
                            <button
                              type="button"
                              onClick={() => {
                                setPreviousBanner(null);
                                setBannerPreview(null);
                                setBanner(null);
                              }}
                              className="px-3 bg-red-400 hover:bg-red-500 text-sm text-white rounded cursor-pointer"
                              aria-label="Remove banner"
                            >
                              Remove
                            </button>
                          )}
                          <label
                            htmlFor="banner"
                            className="px-3 py-1 bg-primary/90 text-sm hover:bg-primary border text-white rounded cursor-pointer"
                          >
                            Upload
                            <input
                              type="file"
                              id="banner"
                              onChange={handleBannerChange}
                              accept="image/*"
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Supported: JPG, PNG, GIF
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setSteps(2)}
                      type="button"
                      aria-label="Go back to previous step"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCompanyPreview(true)}
                    >
                      Preview
                    </Button>
                    <Button
                      disabled={!headline || !name || !email}
                      onClick={() => stepSubmit(3)}
                      type="button"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Section 2: Location and Terms */}
              {steps === 3 && (
                <div className="flex flex-col gap-3 mb-5">
                  <h3 className="text-lg font-semibold">Location and Terms</h3>
                  <div className="grid w-full mb-2 max-w-sm items-center gap-1">
                    <Label htmlFor="city">City</Label>
                    <Input
                      className="p-1"
                      id="city"
                      placeholder="City..."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="grid w-full mb-2 max-w-sm items-center gap-1">
                    <Label htmlFor="state">State</Label>
                    <Input
                      className="p-1"
                      id="state"
                      placeholder="State..."
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                  <div className="grid w-full mb-2 max-w-sm items-center gap-1">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      className="p-1"
                      id="country"
                      placeholder="Country..."
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                  <div className="grid w-full mb-2 max-w-sm items-center gap-1">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      className="p-1"
                      id="address"
                      placeholder="Address..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  {!edit && (
                    <div className="flex w-full mb-2 max-w-sm items-center gap-1">
                      <Checkbox
                        id="terms"
                        checked={checked}
                        onCheckedChange={(val: boolean) => setChecked(val)}
                      />
                      <Label htmlFor="terms" className="ml-2">
                        I agree to the
                        <Link
                          href={"/terms"}
                          className="text-blue-500 ml-1 inline-block"
                        >
                          terms and conditions
                        </Link>
                      </Label>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setSteps(2)}
                      aria-label="Go back to previous step"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCompanyPreview(true)}
                      aria-label="Preview company details"
                    >
                      Preview
                    </Button>
                    <Button
                      disabled={loading}
                      type="submit"
                      aria-label={edit ? "Update Company" : "Create Company"}
                    >
                      {edit ? "Update Company" : "Create Company"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </form>
        <Dialog
          open={companyPreview}
          onOpenChange={(set) => setCompanyPreview(set)}
        >
          <DialogContent className="max-w-2xl">
            <DialogTitle className="text-lg font-semibold">
              Company Preview
            </DialogTitle>
            <Card>
              <CardHeader className="p-0 rounded-2xl pb-3 flex flex-row justify-between items-center gap-2">
                <div className="flex flex-col relative w-full">
                  {bannerPreview ? (
                    <img
                      loading="lazy"
                      src={bannerPreview}
                      alt="banner"
                      className="w-full aspect-[4/1] flex-shrink-0 rounded-t-lg"
                    />
                  ) : (
                    <Image
                      src={back}
                      alt="background"
                      className="w-full aspect-[4/1] flex-shrink-0 rounded-t-lg"
                    />
                  )}
                  <Avatar className="w-24 h-24 md:w-36 p-2 bg-background border-3 border-background md:-mt-16 md:h-36 ml-5 -mt-12">
                    <AvatarImage src={logoPreview || ""} />
                    <AvatarFallback>
                      <Building2 className="w-20 opacity-70 h-20 p-5" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent className="flex justify-between items-start gap-3">
                <div className="flex flex-col gap-1 md:px-4 pt-0 pb-3">
                  <h3 className="md:text-2xl text-xl pb-2 font-semibold">
                    {name || "Company Name"}
                  </h3>
                  <span className="text-sm">
                    {headline || "Company Headline"}
                  </span>
                  <div className="flex justify-start items-center gap-2">
                    <h3 className="text-opacity-50 text-sm -mt-1 opacity-50">
                      {city || "City"}, {state || "State"},{" "}
                      {country || "Country"}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

export default CreateForm;
