
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student', 'parent');

-- Create user_roles table (security best practice - separate from profiles)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create grade_levels table
CREATE TABLE public.grade_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create students table
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    student_id TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    grade_level_id UUID REFERENCES public.grade_levels(id) ON DELETE SET NULL,
    address TEXT,
    parent_name TEXT,
    parent_phone TEXT,
    parent_email TEXT,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'transferred')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create teachers table
CREATE TABLE public.teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    teacher_id TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    qualification TEXT,
    hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create classes table
CREATE TABLE public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    grade_level_id UUID REFERENCES public.grade_levels(id) ON DELETE SET NULL,
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
    room TEXT,
    schedule TEXT,
    capacity INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create class_students junction table
CREATE TABLE public.class_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (class_id, student_id)
);

-- Create attendance table
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (student_id, class_id, date)
);

-- Create subjects table
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create grades/records table
CREATE TABLE public.grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    quarter TEXT NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
    score DECIMAL(5,2),
    grade_letter TEXT,
    remarks TEXT,
    recorded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assignments table
CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    max_score DECIMAL(5,2) DEFAULT 100,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assignment_submissions table
CREATE TABLE public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    score DECIMAL(5,2),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded', 'late')),
    feedback TEXT,
    UNIQUE (assignment_id, student_id)
);

-- Create events/calendar table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location TEXT,
    event_type TEXT DEFAULT 'general' CHECK (event_type IN ('general', 'holiday', 'exam', 'meeting', 'activity')),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fees table
CREATE TABLE public.fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'partial')),
    paid_amount DECIMAL(10,2) DEFAULT 0,
    paid_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    subject TEXT,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create parent_student relationship table
CREATE TABLE public.parent_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    relationship TEXT DEFAULT 'parent',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (parent_user_id, student_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grade_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_students ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own role"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for grade_levels (readable by all authenticated, writable by admin)
CREATE POLICY "Authenticated users can view grade levels"
ON public.grade_levels FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage grade levels"
ON public.grade_levels FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for students
CREATE POLICY "Admins and teachers can view all students"
ON public.students FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Students can view their own record"
ON public.students FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Parents can view their children"
ON public.students FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.parent_students ps 
    WHERE ps.student_id = id AND ps.parent_user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage students"
ON public.students FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for teachers
CREATE POLICY "Authenticated users can view teachers"
ON public.teachers FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Teachers can view their own record"
ON public.teachers FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage teachers"
ON public.teachers FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for classes
CREATE POLICY "Authenticated users can view classes"
ON public.classes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage classes"
ON public.classes FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can manage their classes"
ON public.classes FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'teacher') AND
  teacher_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid())
);

-- RLS Policies for class_students
CREATE POLICY "Authenticated users can view class enrollments"
ON public.class_students FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage class enrollments"
ON public.class_students FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for attendance
CREATE POLICY "Admins and teachers can view all attendance"
ON public.attendance FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Students can view their own attendance"
ON public.attendance FOR SELECT
TO authenticated
USING (
  student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

CREATE POLICY "Parents can view their children's attendance"
ON public.attendance FOR SELECT
TO authenticated
USING (
  student_id IN (
    SELECT student_id FROM public.parent_students WHERE parent_user_id = auth.uid()
  )
);

CREATE POLICY "Admins and teachers can manage attendance"
ON public.attendance FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'teacher')
);

-- RLS Policies for subjects
CREATE POLICY "Authenticated users can view subjects"
ON public.subjects FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage subjects"
ON public.subjects FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for grades
CREATE POLICY "Admins and teachers can view all grades"
ON public.grades FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Students can view their own grades"
ON public.grades FOR SELECT
TO authenticated
USING (
  student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

CREATE POLICY "Parents can view their children's grades"
ON public.grades FOR SELECT
TO authenticated
USING (
  student_id IN (
    SELECT student_id FROM public.parent_students WHERE parent_user_id = auth.uid()
  )
);

CREATE POLICY "Admins and teachers can manage grades"
ON public.grades FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'teacher')
);

-- RLS Policies for assignments
CREATE POLICY "Authenticated users can view assignments"
ON public.assignments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins and teachers can manage assignments"
ON public.assignments FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'teacher')
);

-- RLS Policies for assignment_submissions
CREATE POLICY "Admins and teachers can view all submissions"
ON public.assignment_submissions FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Students can view and manage their own submissions"
ON public.assignment_submissions FOR ALL
TO authenticated
USING (
  student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

CREATE POLICY "Teachers can grade submissions"
ON public.assignment_submissions FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'teacher'));

-- RLS Policies for events
CREATE POLICY "Authenticated users can view events"
ON public.events FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage events"
ON public.events FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for fees
CREATE POLICY "Admins can view all fees"
ON public.fees FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view their own fees"
ON public.fees FOR SELECT
TO authenticated
USING (
  student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

CREATE POLICY "Parents can view their children's fees"
ON public.fees FOR SELECT
TO authenticated
USING (
  student_id IN (
    SELECT student_id FROM public.parent_students WHERE parent_user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage fees"
ON public.fees FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages"
ON public.messages FOR SELECT
TO authenticated
USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their received messages"
ON public.messages FOR UPDATE
TO authenticated
USING (recipient_id = auth.uid());

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can create notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for parent_students
CREATE POLICY "Parents can view their relationships"
ON public.parent_students FOR SELECT
TO authenticated
USING (parent_user_id = auth.uid());

CREATE POLICY "Admins can manage parent relationships"
ON public.parent_students FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, first_name, last_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    NEW.email
  );
  
  -- Assign default role based on metadata or default to 'student'
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'student')
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grades_updated_at
  BEFORE UPDATE ON public.grades
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
