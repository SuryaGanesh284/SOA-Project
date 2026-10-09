package com.archivalia.recommendation.config;

import com.archivalia.recommendation.entity.BookAffinity;
import com.archivalia.recommendation.entity.UserPreference;
import com.archivalia.recommendation.repository.BookAffinityRepository;
import com.archivalia.recommendation.repository.UserPreferenceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RecommendationDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(RecommendationDataInitializer.class);

    private final BookAffinityRepository affinityRepository;
    private final UserPreferenceRepository preferenceRepository;

    public RecommendationDataInitializer(BookAffinityRepository affinityRepository,
                                         UserPreferenceRepository preferenceRepository) {
        this.affinityRepository = affinityRepository;
        this.preferenceRepository = preferenceRepository;
    }

    @Override
    public void run(String... args) {
        if (affinityRepository.count() == 0) {
            log.info("Pre-seeding book affinity catalog for Recommendation Service...");

            List<BookAffinity> books = List.of(
                    new BookAffinity(
                            "The Design of Everyday Things",
                            "Don Norman",
                            "physical",
                            "design,ux,psychology,ergonomics,human-centered",
                            5,
                            "from-sky-500 to-blue-900",
                            9.8,
                            "How everyday objects communicate, and why good design makes them easier to use."
                    ),
                    new BookAffinity(
                            "Clean Code",
                            "Robert C. Martin",
                            "ebooks",
                            "software,clean-code,agile,craftsmanship,refactoring",
                            4,
                            "from-indigo-500 to-slate-900",
                            9.5,
                            "A handbook of agile software craftsmanship for writing code that stays readable."
                    ),
                    new BookAffinity(
                            "The Pragmatic Programmer",
                            "David Thomas",
                            "ebooks",
                            "software,pragmatic,career,best-practices,development",
                            5,
                            "from-emerald-500 to-teal-900",
                            9.7,
                            "Practical habits for building software that is easier to change and maintain."
                    ),
                    new BookAffinity(
                            "Algorithms to Live By",
                            "Brian Christian",
                            "audio",
                            "audio,algorithms,decision-making,psychology,computer-science",
                            4,
                            "from-amber-500 to-orange-900",
                            8.9,
                            "Computer science ideas applied to everyday decisions, from sorting to stopping."
                    ),
                    new BookAffinity(
                            "Structure and Interpretation",
                            "Harold Abelson",
                            "papers",
                            "papers,lisp,scheme,functional-programming,recursion,academic",
                            5,
                            "from-rose-500 to-red-950",
                            9.4,
                            "A classic introduction to programming through abstraction and recursion."
                    ),
                    new BookAffinity(
                            "Deep Work",
                            "Cal Newport",
                            "ebooks",
                            "productivity,focus,career,academic,psychology",
                            5,
                            "from-sky-400 to-blue-800",
                            9.6,
                            "Rules for focused success in a distracted world."
                    ),
                    new BookAffinity(
                            "Atomic Habits",
                            "James Clear",
                            "ebooks",
                            "habits,behavior,psychology,productivity,self-improvement",
                            4,
                            "from-amber-300 to-orange-700",
                            9.7,
                            "An easy and proven way to build good habits and break bad ones."
                    ),
                    new BookAffinity(
                            "Thinking, Fast and Slow",
                            "Daniel Kahneman",
                            "papers",
                            "cognitive-science,psychology,heuristics,behavioral-economics",
                            5,
                            "from-slate-400 to-slate-800",
                            9.5,
                            "The two systems that drive the way we think: fast intuitive thinking, and slow deliberate thinking."
                    ),
                    new BookAffinity(
                            "The Art of Computer Programming",
                            "Donald Knuth",
                            "physical",
                            "algorithms,mathematics,computer-science,classic,foundations",
                            5,
                            "from-rose-400 to-red-900",
                            9.9,
                            "Comprehensive monograph on algorithms and analysis of computing."
                    ),
                    new BookAffinity(
                            "Gödel, Escher, Bach",
                            "Douglas Hofstadter",
                            "ebooks",
                            "logic,math,philosophy,cognition,art,metaphor",
                            4,
                            "from-emerald-400 to-teal-800",
                            9.2,
                            "A metaphorical fugue on minds and machines in the spirit of Lewis Carroll."
                    )
            );

            affinityRepository.saveAll(books);
            log.info("Successfully seeded {} book affinities.", books.size());
        }

        if (preferenceRepository.count() == 0) {
            log.info("Pre-seeding default user preferences for demo users...");
            UserPreference benPref = new UserPreference(
                    "USR-101",
                    "software,ebooks,design,physical",
                    "Robert C. Martin, Don Norman, Cal Newport",
                    4
            );
            preferenceRepository.save(benPref);
            log.info("Seeded preference profile for USR-101.");
        }
    }
}
