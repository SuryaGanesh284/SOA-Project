package com.archivalia.book.config;

import com.archivalia.book.entity.Book;
import com.archivalia.book.entity.CopyStatus;
import com.archivalia.book.entity.Requirement;
import com.archivalia.book.repository.BookRepository;
import com.archivalia.book.repository.RequirementRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class BookDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(BookDataInitializer.class);

    private final BookRepository bookRepository;
    private final RequirementRepository requirementRepository;

    public BookDataInitializer(BookRepository bookRepository, RequirementRepository requirementRepository) {
        this.bookRepository = bookRepository;
        this.requirementRepository = requirementRepository;
    }

    @Override
    public void run(String... args) {
        if (bookRepository.count() == 0) {
            log.info("Seeding initial Archivalia catalog into database...");

            Book b1 = new Book("The Design of Everyday Things", "Don Norman", 2013, 5,
                    "from-sky-500 to-blue-900", "physical,reading-now,quiet",
                    "How everyday objects communicate, and why good design makes them easier to use.");
            b1.addCopy("PHY-014", CopyStatus.BORROWED, "On loan");
            b1.addCopy("PHY-015", CopyStatus.AVAILABLE, "Shelf A3");

            Book b2 = new Book("Clean Code", "Robert C. Martin", 2008, 4,
                    "from-indigo-500 to-slate-900", "ebooks,saved,research",
                    "A handbook of agile software craftsmanship for writing code that stays readable.");
            b2.addCopy("DIG-102", CopyStatus.AVAILABLE, "Online");

            Book b3 = new Book("The Pragmatic Programmer", "David Thomas", 2019, 5,
                    "from-emerald-500 to-teal-900", "ebooks,saved",
                    "Practical habits for building software that is easier to change and maintain.");
            b3.addCopy("DIG-118", CopyStatus.AVAILABLE, "Online");

            Book b4 = new Book("Algorithms to Live By", "Brian Christian", 2016, 4,
                    "from-amber-500 to-orange-900", "audio,due-soon",
                    "Computer science ideas applied to everyday decisions, from sorting to stopping.");
            b4.addCopy("AUD-021", CopyStatus.AVAILABLE, "Online");

            Book b5 = new Book("Structure and Interpretation", "Harold Abelson", 1996, 5,
                    "from-rose-500 to-red-950", "papers,research",
                    "A classic introduction to programming through abstraction and recursion.");
            b5.addCopy("PAP-044", CopyStatus.AVAILABLE, "Online");

            Book b6 = new Book("Deep Work", "Cal Newport", 2016, 5,
                    "from-sky-400 to-blue-800", "ebooks,reading-now,quiet",
                    "Rules for focused success in a distracted world.");
            b6.addCopy("DIG-130", CopyStatus.AVAILABLE, "Online");

            Book b7 = new Book("Atomic Habits", "James Clear", 2018, 4,
                    "from-amber-300 to-orange-700", "audio,saved,quiet",
                    "A practical guide to building better habits through small changes.");
            b7.addCopy("AUD-033", CopyStatus.AVAILABLE, "Online");

            Book b8 = new Book("Thinking, Fast and Slow", "Daniel Kahneman", 2011, 5,
                    "from-slate-400 to-slate-800", "papers,due-soon,history",
                    "How two modes of thought shape judgment and decision making.");
            b8.addCopy("PAP-051", CopyStatus.AVAILABLE, "Online");

            Book b9 = new Book("The Art of Computer Programming", "Donald Knuth", 1968, 5,
                    "from-rose-400 to-red-900", "physical,classics",
                    "A foundational reference on algorithms and their analysis.");
            b9.addCopy("PHY-201", CopyStatus.AVAILABLE, "Shelf C1");
            b9.addCopy("PHY-202", CopyStatus.MAINTENANCE, "Repair");

            Book b10 = new Book("Gödel, Escher, Bach", "Douglas Hofstadter", 1979, 4,
                    "from-emerald-400 to-teal-800", "videos,classics",
                    "An exploration of patterns, meaning, and self-reference.");
            b10.addCopy("VID-008", CopyStatus.AVAILABLE, "Online");

            bookRepository.saveAll(Arrays.asList(b1, b2, b3, b4, b5, b6, b7, b8, b9, b10));
            log.info("Seeded {} books with copies.", bookRepository.count());
        }

        if (requirementRepository.count() == 0) {
            log.info("Seeding initial inventory requirements...");
            Requirement r1 = new Requirement("Designing Data-Intensive Applications", "Requested for the databases course");
            r1.setStatus("OPEN");

            Requirement r2 = new Requirement("The Art of Computer Programming, Vol. 2", "Second volume for the stacks");
            r2.setStatus("FULFILLED");

            requirementRepository.saveAll(Arrays.asList(r1, r2));
            log.info("Seeded {} requirements.", requirementRepository.count());
        }
    }
}
