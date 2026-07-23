"use client";

import { Trash2 } from "lucide-react";

interface Props{

    onDelete:()=>void;

}

export function RowActions({

    onDelete,

}:Props){

    return(

        <button

            onClick={onDelete}

            className="rounded p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"

        >

            <Trash2 size={16}/>

        </button>

    );

}