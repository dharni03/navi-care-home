-- Create user profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('patient', 'hospital', 'admin')),
  location_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create locations table for city/town/village mapping
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('city', 'town', 'village')),
  state TEXT NOT NULL,
  district TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hospitals table
CREATE TABLE public.hospitals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hospital_name TEXT NOT NULL,
  address TEXT NOT NULL,
  location_id UUID NOT NULL REFERENCES public.locations(id),
  phone TEXT NOT NULL,
  email TEXT,
  specializations TEXT[],
  emergency_contact TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  qualification TEXT,
  experience_years INTEGER,
  available_days TEXT[],
  available_hours TEXT,
  consultation_fee DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  blood_group TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  medical_conditions TEXT[],
  allergies TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create emergency alerts table
CREATE TABLE public.emergency_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES public.locations(id),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('ambulance', 'emergency', 'critical')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'responded', 'resolved', 'cancelled')),
  patient_location TEXT,
  contact_number TEXT,
  description TEXT,
  responded_by UUID REFERENCES public.hospitals(id),
  response_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medical records table
CREATE TABLE public.medical_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  diagnosis TEXT,
  treatment TEXT,
  medications TEXT[],
  lab_results TEXT,
  notes TEXT,
  visit_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for locations (public read)
CREATE POLICY "Locations are viewable by everyone" ON public.locations
  FOR SELECT USING (true);

-- Create RLS policies for hospitals
CREATE POLICY "Hospitals can view their own data" ON public.hospitals
  FOR SELECT USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Hospitals can update their own data" ON public.hospitals
  FOR UPDATE USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Hospitals can insert their own data" ON public.hospitals
  FOR INSERT WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Patients can view hospitals" ON public.hospitals
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND user_type = 'patient')
  );

-- Create RLS policies for doctors
CREATE POLICY "Hospital staff can manage doctors" ON public.doctors
  FOR ALL USING (
    hospital_id IN (
      SELECT h.id FROM public.hospitals h
      JOIN public.profiles p ON h.profile_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can view doctors" ON public.doctors
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND user_type = 'patient')
  );

-- Create RLS policies for patients
CREATE POLICY "Patients can view their own data" ON public.patients
  FOR SELECT USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Patients can update their own data" ON public.patients
  FOR UPDATE USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Patients can insert their own data" ON public.patients
  FOR INSERT WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Hospitals can view their patients" ON public.patients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      JOIN public.hospitals h ON a.hospital_id = h.id
      JOIN public.profiles p ON h.profile_id = p.id
      WHERE p.user_id = auth.uid() AND a.patient_id = patients.id
    )
  );

-- Create RLS policies for appointments
CREATE POLICY "Patients can view their appointments" ON public.appointments
  FOR ALL USING (
    patient_id IN (
      SELECT pt.id FROM public.patients pt
      JOIN public.profiles p ON pt.profile_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Hospitals can view their appointments" ON public.appointments
  FOR ALL USING (
    hospital_id IN (
      SELECT h.id FROM public.hospitals h
      JOIN public.profiles p ON h.profile_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- Create RLS policies for emergency alerts
CREATE POLICY "Patients can manage their alerts" ON public.emergency_alerts
  FOR ALL USING (
    patient_id IN (
      SELECT pt.id FROM public.patients pt
      JOIN public.profiles p ON pt.profile_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Hospitals can view alerts in their area" ON public.emergency_alerts
  FOR SELECT USING (
    location_id IN (
      SELECT h.location_id FROM public.hospitals h
      JOIN public.profiles p ON h.profile_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Hospitals can respond to alerts" ON public.emergency_alerts
  FOR UPDATE USING (
    responded_by IN (
      SELECT h.id FROM public.hospitals h
      JOIN public.profiles p ON h.profile_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- Create RLS policies for medical records
CREATE POLICY "Patients can view their medical records" ON public.medical_records
  FOR SELECT USING (
    patient_id IN (
      SELECT pt.id FROM public.patients pt
      JOIN public.profiles p ON pt.profile_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Hospitals can manage medical records" ON public.medical_records
  FOR ALL USING (
    hospital_id IN (
      SELECT h.id FROM public.hospitals h
      JOIN public.profiles p ON h.profile_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX idx_hospitals_location_id ON public.hospitals(location_id);
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX idx_appointments_hospital_id ON public.appointments(hospital_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_emergency_alerts_location_id ON public.emergency_alerts(location_id);
CREATE INDEX idx_emergency_alerts_status ON public.emergency_alerts(status);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hospitals_updated_at
  BEFORE UPDATE ON public.hospitals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, full_name, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'patient')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert sample locations
INSERT INTO public.locations (name, type, state, district) VALUES
('Chennai', 'city', 'Tamil Nadu', 'Chennai'),
('Madurai', 'city', 'Tamil Nadu', 'Madurai'),
('Coimbatore', 'city', 'Tamil Nadu', 'Coimbatore'),
('Thiruvananthapuram', 'city', 'Kerala', 'Thiruvananthapuram'),
('Kochi', 'city', 'Kerala', 'Ernakulam'),
('Hyderabad', 'city', 'Telangana', 'Hyderabad'),
('Visakhapatnam', 'city', 'Andhra Pradesh', 'Visakhapatnam'),
('Bengaluru', 'city', 'Karnataka', 'Bengaluru Urban'),
('Mumbai', 'city', 'Maharashtra', 'Mumbai'),
('Delhi', 'city', 'Delhi', 'New Delhi');