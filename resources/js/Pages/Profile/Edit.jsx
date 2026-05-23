import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageHead } from "@/Components/PageHead";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-lg sm:text-xl md:text-xl lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold leading-tight text-gray-800">
                    Profile
                </h2>
            }
        >
            <PageHead title="Profile" />

            <div className="py-4 sm:py-6 md:py-8 lg:py-12 xl:py-16 2xl:py-20">
                <div className="mx-auto max-w-7xl space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-6 xl:space-y-8 2xl:space-y-10 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12">
                    {/* Profile Information Form */}
                    <div className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 2xl:p-10 shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl"
                        />
                    </div>

                    {/* Password Update Form */}
                    <div className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 2xl:p-10 shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl" />
                    </div>

                    {/* Delete User Form */}
                    <div className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 2xl:p-10 shadow sm:rounded-lg">
                        <DeleteUserForm className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
