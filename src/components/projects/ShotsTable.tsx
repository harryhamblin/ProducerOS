interface ShotsTableProps {
    projectID: string;
    bidID: string;

    bidShots: BidShot[];

    bidTasks: Map<
        number,
        Map<number, BidTask>
    >;

    projectTasks: ProjectTask[];

    calculatedBid: CalculatedBid;
}