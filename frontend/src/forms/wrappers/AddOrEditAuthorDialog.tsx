// import { authorSchema } from '@/schemas/abstract-schemas'
// import { zodResolver } from '@hookform/resolvers/zod'
// import React from 'react'
// import { FormProvider, useForm } from 'react-hook-form'
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"

// function AddOrEditAuthorDialog() {
//     const form = useForm({
//         resolver: zodResolver(authorSchema),
//         mode: 'onSubmit',
//         defaultValues: {
//             first_name: '',
//             last_name: '',
//             email: '',
//             affiliation: {
//                 city: '',
//                 department: '',
//                 institute: '',
//                 nationality: '',
//             }
//         }
//     })


//     return (
//         <AlertDialog>
//             <AlertDialogContent className="sm:max-w-2xl!">
//                 <AlertDialogHeader>
//                     <AlertDialogTitle>Add New Author</AlertDialogTitle>
//                     <AlertDialogDescription>
//                         Escribe los datos de contacto y de afiliación del autor.
//                     </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4 border-y-2">
//                     <AuthorForm abstractId={data.id} author={authors?.find(x => x.id === authorToEdit)} onSubmit={() => {
//                         setOpen(false)
//                         fetchAuthors()
//                     }} />
//                 </div>
//                 <FormProvider {...form}>
//                     <div>

//                     </div>
//                 </FormProvider>
//                 <AlertDialogFooter>
//                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                     <Button type='submit' form='authors-form' onClick={() => {
//                         console.log('QUEEE');

//                     }}>Continue</Button>
//                 </AlertDialogFooter>
//             </AlertDialogContent>
//         </AlertDialog>
//     )
// }

// export default AddOrEditAuthorDialog