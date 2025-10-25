import {Card} from "@/components/ui/card";
import React, {JSX} from "react";
import Image from "next/image";

interface InfoCardProps {
    header: string;
    description: string;
    imgSrc: string;
    type?: 'rightAlignImage';
}

const InfoCard = ({header, description, imgSrc, type}: InfoCardProps): JSX.Element => {
    return (
        <Card className={`flex flex-col gap-8 md:flex-row-reverse min-h-0 ${type === "rightAlignImage" ? "md:flex-row" : ""}`}>
            <div className="w-full md:w-1/2 flex-col flex gap-4 justify-center">
                <h2 className="text-2xl sm:text-3xl sm:truncate md:text-4xl font-bold text-pretty">
                    {header}
                </h2>
                <p className="text-foreground-secondary text-base sm:text-lg leading-relaxed">
                    {description}
                </p>
            </div>
            <div className="w-full md:w-1/2">
                <Image
                    src={imgSrc}
                    alt={header}
                    width={1206}
                    height={796}
                    className="h-auto w-full rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
        </Card>
    );
}

export default InfoCard;
