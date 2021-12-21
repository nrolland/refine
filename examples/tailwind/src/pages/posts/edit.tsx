import React, { useEffect, useState } from "react";
import {
    Edit,
    IResourceComponentsProps,
    useSelect,
    useWarnAboutChange,
    useForm as useFormCore,
} from "@pankod/refine-core";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";

import "react-mde/lib/styles/css/react-mde-all.css";

import { IPost, ICategory } from "interfaces";

export const PostEdit: React.FC<IResourceComponentsProps> = () => {
    const [selectedTab, setSelectedTab] =
        useState<"write" | "preview">("write");

    const { warnWhenUnsavedChanges, setWarnWhen } = useWarnAboutChange();

    const {
        formLoading,
        onFinish,
        editId,
        queryResult: queryResultForm,
    } = useFormCore<IPost>({
        warnWhenUnsavedChanges: true,
        redirect: false,
        onMutationSuccess: () => {
            reset();
        },
    });

    const { queryResult, defaultValueQueryResult, selectProps } =
        useSelect<ICategory>({
            resource: "categories",
            defaultValue: queryResultForm?.data?.data.category.id,
        });

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const { data, isFetching } = queryResultForm ?? {};

    useEffect(() => {
        Object.entries(queryResultForm?.data?.data || {}).forEach(
            ([key, value]) => {
                setValue(key, value);
            },
        );
        return () => {
            reset();
        };
    }, [
        /* queryResultForm?. */ data,
        editId,
        /* queryResultForm?. */ isFetching,
    ]);

    useEffect(() => {
        const subscription = watch((values, { type }) => {
            if (type === "change") {
                onValuesChange(values);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const onValuesChange = (changeValues: Record<string, any>) => {
        if (warnWhenUnsavedChanges) {
            setWarnWhen(true);
        }
        return changeValues;
    };

    return (
        <Edit
            saveButtonProps={{
                onClick: handleSubmit(onFinish),
                loading: formLoading,
            }}
        >
            {!queryResultForm?.isLoading && (
                <form onSubmit={handleSubmit(onFinish)}>
                    <label
                        htmlFor="title"
                        className="inline-block mb-2 text-gray-700 font-bold"
                    >
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        className="w-full px-3 py-1.5 text-gray-700 bg-white border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                        {...register("title", {
                            required: "Title is required",
                        })}
                    />
                    <ErrorMessage
                        errors={errors}
                        name="title"
                        render={({ message }) => (
                            <p className="text-red-500">{message}</p>
                        )}
                    />

                    <label
                        htmlFor="category"
                        className="inline-block mb-2 text-gray-700 font-bold mt-4"
                    >
                        Category
                    </label>
                    {!queryResult.isLoading &&
                        !defaultValueQueryResult.isLoading && (
                            <select
                                id="category"
                                className="appearance-none w-full px-3 py-1.5 text-gray-700 bg-white border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                                aria-label="Category select"
                                {...register("category.id", {
                                    required: "Category is required",
                                    valueAsNumber: true,
                                })}
                            >
                                {selectProps.options?.map((category) => (
                                    <option
                                        key={category.value}
                                        value={category.value}
                                    >
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        )}
                    <ErrorMessage
                        errors={errors}
                        name="category"
                        render={({ message }) => (
                            <p className="text-red-500">{message}</p>
                        )}
                    />

                    <label
                        htmlFor="status"
                        className="inline-block mb-2 text-gray-700 font-bold mt-4"
                    >
                        Status
                    </label>
                    <select
                        id="status"
                        className="appearance-none w-full px-3 py-1.5 text-gray-700 bg-white border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                        aria-label="Status select"
                        {...register("status", {
                            required: "Status is required",
                        })}
                    >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <ErrorMessage
                        errors={errors}
                        name="status"
                        render={({ message }) => (
                            <p className="text-red-500">{message}</p>
                        )}
                    />

                    <label className="inline-block mb-2 text-gray-700 font-bold mt-4">
                        Content
                    </label>
                    <Controller
                        control={control}
                        name="content"
                        rules={{ required: "Content is required" }}
                        render={({ field: { onChange, ref, value } }) => (
                            <ReactMde
                                ref={ref}
                                value={value}
                                onChange={onChange}
                                selectedTab={selectedTab}
                                onTabChange={setSelectedTab}
                                generateMarkdownPreview={(markdown) =>
                                    Promise.resolve(
                                        <ReactMarkdown>
                                            {markdown}
                                        </ReactMarkdown>,
                                    )
                                }
                            />
                        )}
                    />
                    <ErrorMessage
                        errors={errors}
                        name="content"
                        render={({ message }) => (
                            <p className="text-red-500">{message}</p>
                        )}
                    />
                </form>
            )}
        </Edit>
    );
};
