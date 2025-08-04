const Workout = require("../models/Workout");
const { errorHandler } = require("../auth");

module.exports.addWorkout = async (req, res) => {
	try {
		const { name, duration } = req.body;

		const newWorkout = await Workout.create({
			userId: req.user.id,
			name,
			duration
		});

		res.status(201).json({ message: "Workout logged", workout: newWorkout });
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

module.exports.getMyWorkouts = async (req, res) => {
	try {
		const workouts = await Workout.find({ userId: req.user.id }).sort({ dateAdded: -1 });
		res.status(200).json(workouts);
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

module.exports.updateWorkout = async (req, res) => {
	try {
		const { workoutId } = req.params;
		const { name, duration } = req.body;

		const updated = await Workout.findByIdAndUpdate(
			workoutId,
			{ name, duration },
			{ new: true }
		);

		if (!updated) return res.status(404).json({ message: "Workout not found" });

		res.status(200).json({ message: "Workout updated", workout: updated });
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

module.exports.deleteWorkout = async (req, res) => {
	try {
		const { workoutId } = req.params;

		const deleted = await Workout.findByIdAndDelete(workoutId);

		if (!deleted) return res.status(404).json({ message: "Workout not found" });

		res.status(200).json({ message: "Workout deleted" });
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

module.exports.completeWorkoutStatus = async (req, res) => {
	try {
		const { workoutId } = req.params;

		const updated = await Workout.findByIdAndUpdate(
			workoutId,
			{ status: "completed" },
			{ new: true }
		);

		if (!updated) return res.status(404).json({ message: "Workout not found" });

		res.status(200).json({ message: "Workout marked as completed", workout: updated });
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};
